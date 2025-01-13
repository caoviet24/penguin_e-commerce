using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.Voucher.Commands.Update
{
    public class UpdateVoucherCommand : IRequest<VoucherDto>
    {
        public string voucher_id { get; set; } = null!;
        public string voucher_type { get; set; } = null!;
        public string voucher_name { get; set; } = null!;
        public string apply_for { get; set; } = null!;
        public int after_expiry_date { get; set; }
        public string option_expiry_date { get; set; } = null!;
        public int quantity_remain { get; set; }
        public int quantity_used { get; set; }
        public Double discount { get; set; }
        public string type_discount { get; set; } = null!;
    }
    public class UpdateVoucherHandler(IDbConnection dbConnection) : IRequestHandler<UpdateVoucherCommand, VoucherDto>
    {
         public async Task<VoucherDto> Handle(UpdateVoucherCommand request, CancellationToken cancellationToken)
        {
            DateTime _expriy_date = DateTime.UtcNow;
            if (request.option_expiry_date == "minute")
            {
                _expriy_date = DateTime.UtcNow.AddMinutes(request.after_expiry_date);
            }
            if (request.option_expiry_date == "hour")
            {
                _expriy_date = DateTime.UtcNow.AddHours(request.after_expiry_date);
            }
            else if (request.option_expiry_date == "day")
            {
                _expriy_date = DateTime.UtcNow.AddDays(request.after_expiry_date);
            }
            else if(request.option_expiry_date == "week")
            {
                _expriy_date = DateTime.UtcNow.AddDays(request.after_expiry_date * 7);
            }
            else if(request.option_expiry_date == "month")
            {
                _expriy_date = DateTime.UtcNow.AddMonths(request.after_expiry_date);
            }
            else if(request.option_expiry_date == "year")
            {
                _expriy_date = DateTime.UtcNow.AddYears(request.after_expiry_date);
            }

            var data = await dbConnection.QueryFirstOrDefaultAsync<VoucherDto>(
                "sp_update_voucher_by_id",
                new
                {
                    voucher_id = request.voucher_id,
                    voucher_type = request.voucher_type,
                    voucher_name = request.voucher_name,
                    apply_for = request.apply_for,
                    expiry_date = _expriy_date,
                    quantity_remain = request.quantity_remain,
                    quantity_used = request.quantity_used,
                    discount = request.discount,
                    type_discount = request.type_discount
                }
            );
            return data;
        }
    }
}