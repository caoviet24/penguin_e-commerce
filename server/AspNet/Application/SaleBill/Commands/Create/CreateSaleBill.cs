using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;

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
        public double total { get; set; }
        public string pay_method { get; set; } = null!;
        public string name_receiver { get; set; } = null!;
        public string address_receiver { get; set; } = null!;
        public string phone_receiver { get; set; } = null!;
        public List<CreateSaleBillDetailCommand> list_bill_detail { get; set; } = new List<CreateSaleBillDetailCommand>();
        public List<CreateVoucherUseBillSaleCommand> list_voucher { get; set; } = new List<CreateVoucherUseBillSaleCommand>();
    }

    public class CreateSaleBillCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateSaleBillCommand, SaleBillDto>
    {
        public async Task<SaleBillDto> Handle(CreateSaleBillCommand request, CancellationToken cancellationToken)
        {
            using var transaction = context.Database.BeginTransaction();
            try
            {
                var newBill = mapper.Map<SaleBillEntity>(request);

                var data = await context.SaleBills.AddAsync(newBill, cancellationToken);

                foreach (var detailRequest in request.list_bill_detail)
                {
                    var newBillDetai = mapper.Map<SaleBillDetailEntity>(detailRequest);
                    newBillDetai.sale_bill_id = data.Entity.Id;
                    await context.SaleBillDetails.AddAsync(newBillDetai, cancellationToken);
                }

                foreach (var voucherRequest in request.list_voucher)
                {
                    var newVoucherInBill = mapper.Map<VoucherUseSaleBillEntity>(voucherRequest);
                    newVoucherInBill.bill_id = data.Entity.Id;
                    await context.VoucherUseSaleBills.AddAsync(newVoucherInBill, cancellationToken);
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