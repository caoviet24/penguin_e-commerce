using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using Domain.Enums;
using MediatR;
using WebApi.DBHelper;

namespace Application.SaleBill.Commands.CreateSaleBill
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
    public class CreateSaleBillHanlder(IDbHelper dbHelper, IUser user) : IRequestHandler<CreateSaleBillCommand, SaleBillDto>
    {
        public async Task<SaleBillDto> Handle(CreateSaleBillCommand request, CancellationToken cancellationToken)
        {


            var billId = Guid.NewGuid().ToString();
            var billData = await dbHelper.QueryProceduceSingleDataAsync<SaleBillDto>
            (
                "sp_create_sale_bill",
                new
                {
                    bill_id = billId,
                    status_bill = StatusBillSale.waitting,
                    pay_method = request.pay_method,
                    total_bill = request.total,
                    seller_id = request.seller_id,
                    buyer_id = user.getCurrentUser(),
                    created_at = DateTime.UtcNow,
                    updated_by = user.getCurrentUser(),
                    last_updated = DateTime.UtcNow,
                    name_receiver = request.name_receiver,
                    address_receiver = request.address_receiver,
                    phone_receiver = request.phone_receiver,
                    is_deleted = false
                }
            );

            foreach (var item in request.list_bill_detail)
            {
                var detailData = await dbHelper.QueryProceduceSingleDataAsync<SaleBillDetailDto>
                (
                    "sp_create_sale_bill_detail",
                    new
                    {
                        Id = Guid.NewGuid().ToString(),
                        bill_id = billId,
                        product_detail_id = item.product_detail_id,
                        quantity = item.quantity,
                        size = item.size,
                        color = item.color,
                    }

                );

            }
            foreach (var itemVch in request.list_voucher)
            {
                var voucherData = await dbHelper.QueryProceduceSingleDataAsync<SaleBillDetailDto>
                (
                    "sp_create_voucher_use_bill_sale",
                    new
                    {
                        Id = Guid.NewGuid().ToString(),
                        bill_id = billId,
                        voucher_id = itemVch.voucher_id,
                    }
                );
            }

            return billData;
        }
    }

}