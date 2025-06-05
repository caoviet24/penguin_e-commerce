using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Events;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.SaleBill.Commands.Create
{
    public class CreateVoucherUseBillSaleCommand
    {
        public string voucher_id { get; set; } = null!;
    }
    public class CreateSaleBillDetailCommand : IRequest<SaleBillDetailDto>
    {
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
    }
    public class CreateSaleBillCommand : IRequest<SaleBillDto>
    {
        public string seller_id { get; set; } = null!;
        public double total_bill { get; set; }
        public string pay_method { get; set; } = null!;
        public string address_delivery_id { get; set; } = null!;
        public List<string> list_order_item { get; set; } = new List<string>();
        public List<CreateSaleBillDetailCommand> list_bill_detail { get; set; } = new List<CreateSaleBillDetailCommand>();
        public List<CreateVoucherUseBillSaleCommand> list_voucher { get; set; } = new List<CreateVoucherUseBillSaleCommand>();
    }

    public class CreateSaleBillCommandHandler(IApplicationDbContext context, IMapper mapper, IMediator mediator) : IRequestHandler<CreateSaleBillCommand, SaleBillDto>
    {
        public async Task<SaleBillDto> Handle(CreateSaleBillCommand request, CancellationToken cancellationToken)
        {
            using var transaction = context.Database.BeginTransaction();
            try
            {
                var newBill = mapper.Map<SaleBillEntity>(request);
                newBill.Id = Guid.NewGuid().ToString();
                newBill.status = "PENDING";


                var data = await context.SaleBills.AddAsync(newBill, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                foreach (var detailRequest in request.list_bill_detail)
                {
                    var newBillDetai = mapper.Map<SaleBillDetailEntity>(detailRequest);

                    var findProductDetail = await context.ProductDetails.FindAsync(detailRequest.product_detail_id, cancellationToken);
                    if (findProductDetail == null)
                    {
                        throw new BadRequestException("Product detail not found.");
                    }

                    if (findProductDetail.stock_quantity < detailRequest.quantity)
                    {
                        throw new BadRequestException("Insufficient stock for product detail.");
                    }
                    findProductDetail.stock_quantity -= detailRequest.quantity;
                    context.ProductDetails.Update(findProductDetail);
                    await context.SaveChangesAsync(cancellationToken);


                    newBillDetai.sale_bill_id = data.Entity.Id;
                    newBillDetai.Id = Guid.NewGuid().ToString();

                    await context.SaleBillDetails.AddAsync(newBillDetai, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                }

                foreach (var voucherRequest in request.list_voucher)
                {
                    var newVoucherInBill = mapper.Map<VoucherUseSaleBillEntity>(voucherRequest);


                    var findVoucher = await context.Vouchers.FindAsync(voucherRequest.voucher_id, cancellationToken);
                    if (findVoucher == null)
                    {
                        throw new BadRequestException("Voucher not found.");
                    }

                    if (findVoucher.expiry_date < DateTime.UtcNow)
                    {
                        throw new BadRequestException("Voucher has expired.");
                    }

                    if (findVoucher.quantity_remain <= 0)
                    {
                        throw new BadRequestException("Voucher is out of stock.");
                    }

                    findVoucher.quantity_remain -= 1;
                    context.Vouchers.Update(findVoucher);
                    await context.SaveChangesAsync(cancellationToken);

                    newVoucherInBill.bill_id = data.Entity.Id;
                    newVoucherInBill.Id = Guid.NewGuid().ToString();
                    await context.VoucherUseSaleBills.AddAsync(newVoucherInBill, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);

                }

                foreach (var item in request.list_order_item)
                {
                    var checkOrderItem = await context.OrderItems
                        .FirstOrDefaultAsync(x => x.Id == item, cancellationToken);

                    if (checkOrderItem == null)
                    {
                        throw new BadRequestException($"Order item with ID {item} not found.");
                    }

                    context.OrderItems.Remove(checkOrderItem);
                    await context.SaveChangesAsync(cancellationToken);
                }

                // await context.Notifies.AddAsync(
                //     new NotifyEntity
                //     {
                //         Id = Guid.NewGuid().ToString(),
                //         content = $"Người dùng {data.Entity.created_by} đã tạo đơn hàng mới với mã đơn hàng {data.Entity.Id}.",
                //         type = "SALE_BILL",
                //         image = "https://example.com/image.png",
                //         is_read = false,
                //         link = "",
                //         receiver_id = request.seller_id,
                //         title = "Thông báo đơn hàng mới",
                //     },
                //     cancellationToken
                // );
                // await context.SaveChangesAsync(cancellationToken);

                // Get buyer information for email notification
                var buyer = await context.Accounts.FindAsync(data.Entity.created_by, cancellationToken);
                if (buyer != null && !string.IsNullOrEmpty(buyer.email))
                {
                    var orderCreatedEvent = new OrderCreatedEvent(
                        data.Entity.Id,
                        buyer.Id,
                        buyer.username,
                        buyer.email,
                        request.total_bill
                    );
                    await mediator.Publish(orderCreatedEvent, cancellationToken);
                }

                await context.Database.CommitTransactionAsync(cancellationToken);
                return mapper.Map<SaleBillDto>(data.Entity);
            }
            catch (System.Exception)
            {

                await context.Database.RollbackTransactionAsync(cancellationToken);
                throw;
            }


        }
    }
}