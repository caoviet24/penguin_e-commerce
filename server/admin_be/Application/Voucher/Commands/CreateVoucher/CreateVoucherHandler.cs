using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using Application.Common.Dtos;
using Domain.Enums;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.Voucher.Commands.CreateVoucher
{
    public class CreateVoucherCommand : IRequest<VoucherDto>
    {
        public string voucher_type { get; set; } = null!;
        public string voucher_name { get; set; } = null!;
        public string apply_for { get; set; } = null!;
        public int after_expiry_date { get; set; }
        public string option_expiry_date { get; set; } = null!;
        public int quantity_remain { get; set; }
        public Double discount { get; set; }
        public string type_discount { get; set; } = null!;
    }
    public class CreateVoucherHandler(IDbHelper dbHelper) : IRequestHandler<CreateVoucherCommand, VoucherDto>
    {

        public async Task<VoucherDto> Handle(CreateVoucherCommand request, CancellationToken cancellationToken)
        {
            try
            {
                string _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                DateTime _expriy_date = DateTime.Now;
                 if(request.option_expiry_date == "minute")
                {
                    _expriy_date = DateTime.Now.AddMinutes(request.after_expiry_date);
                }
                if(request.option_expiry_date == "hour")
                {
                    _expriy_date = DateTime.Now.AddHours(request.after_expiry_date);
                }
                else if(request.option_expiry_date == "day")
                {
                    _expriy_date = DateTime.Now.AddDays(request.after_expiry_date);
                }

                var data = await dbHelper.QueryProceduceByUserAsync<VoucherDto>(
                    "sp_create_voucher",
                    new
                    {
                        voucher_id = Guid.NewGuid().ToString(),
                        voucher_type = request.voucher_type,
                        voucher_name = request.voucher_name,
                        apply_for = request.apply_for,
                        voucher_code = new string(Enumerable.Repeat(_chars, 10).Select(s => s[new Random().Next(s.Length)]).ToArray()),
                        expiry_date = _expriy_date,
                        quantity_remain = request.quantity_remain,
                        quantity_used = 0,
                        discount = request.discount,
                        status_voucher = StatusVoucher.Inactive,
                        type_discount = request.type_discount
                    }
                );
                return data;
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }
    }
}