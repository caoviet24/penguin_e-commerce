using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Enums.status;
using Domain.Exceptions;
using MediatR;


namespace Application.Voucher.Commands.Create
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
    public class CreateVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(CreateVoucherCommand request, CancellationToken cancellationToken)
        {
            string _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
            else if (request.option_expiry_date == "week")
            {
                _expriy_date = DateTime.UtcNow.AddDays(request.after_expiry_date * 7);
            }
            else if (request.option_expiry_date == "month")
            {
                _expriy_date = DateTime.UtcNow.AddMonths(request.after_expiry_date);
            }
            else if (request.option_expiry_date == "year")
            {
                _expriy_date = DateTime.UtcNow.AddYears(request.after_expiry_date);
            }


            var voucher = mapper.Map<VoucherEntity>(request);
            voucher.voucher_code = new string(Enumerable.Repeat(_chars, 10).Select(s => s[new Random().Next(s.Length)]).ToArray());
            voucher.expiry_date = _expriy_date;
            voucher.status = (int)StatusVoucher.ACTIVE;
            voucher.quantity_used = 0;
            voucher.Id = Guid.NewGuid().ToString();
            var newVoucher = await context.Vouchers.AddAsync(voucher, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            var voucherDto = mapper.Map<VoucherDto>(newVoucher.Entity);
            return voucherDto;
        }
    }
}