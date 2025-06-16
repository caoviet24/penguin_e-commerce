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
        public DateTime expiry_date { get; set; }
        public int quantity_remain { get; set; }
        public Double discount { get; set; }
        public string type_discount { get; set; } = null!;
    }
    public class CreateVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(CreateVoucherCommand request, CancellationToken cancellationToken)
        {
            string _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            var voucher = mapper.Map<VoucherEntity>(request);
            voucher.voucher_code = new string(Enumerable.Repeat(_chars, 10).Select(s => s[new Random().Next(s.Length)]).ToArray());
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