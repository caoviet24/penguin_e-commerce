using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Dapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;

namespace Application.Voucher.Commands.Update
{
    public class UpdateVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
        public string voucher_type { get; set; } = null!;
        public string voucher_name { get; set; } = null!;
        public string apply_for { get; set; } = null!;
        public DateTime expiry_date { get; set; }
        public int quantity_remain { get; set; }
        public Double discount { get; set; }
        public string type_discount { get; set; } = null!;
        public int status { get; set; }

    }
    public class UpdateVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(UpdateVoucherCommand request, CancellationToken cancellationToken)
        {
            var findVoucher = await context.Vouchers.FindAsync(request.Id);
            if (findVoucher == null)
            {
                throw new NotFoundException("Voucher not found");
            }

            // Update properties of the existing entity instead of creating a new one
            findVoucher.voucher_type = request.voucher_type;
            findVoucher.voucher_name = request.voucher_name;
            findVoucher.apply_for = request.apply_for;
            findVoucher.expiry_date = request.expiry_date;
            findVoucher.quantity_remain = request.quantity_remain;
            findVoucher.discount = request.discount;
            findVoucher.type_discount = request.type_discount;
            findVoucher.status = request.status;

            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<VoucherDto>(findVoucher);
        }
    }
}