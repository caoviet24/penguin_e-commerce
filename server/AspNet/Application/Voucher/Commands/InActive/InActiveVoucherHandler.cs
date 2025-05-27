using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Enums.status;
using Domain.Exceptions;
using MediatR;


namespace Application.Voucher.Commands.InActive
{
    public class InActiveVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class InActiveVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<InActiveVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(InActiveVoucherCommand request, CancellationToken cancellationToken)
        {
            var findVoucher = await context.Vouchers.FindAsync(request.Id);
            if (findVoucher == null)
            {
                throw new NotFoundException("Voucher not found");
            }

            findVoucher.status = (int)StatusVoucher.INACTIVE;

            var result = context.Vouchers.Update(findVoucher);
            await context.SaveChangesAsync(cancellationToken);
            var voucher = mapper.Map<VoucherDto>(result.Entity);
            return voucher;
        }
    }
}