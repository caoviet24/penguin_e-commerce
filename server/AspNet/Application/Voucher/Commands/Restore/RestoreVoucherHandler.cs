using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;


namespace Application.Voucher.Commands.Restore
{
    public class RestoreVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<RestoreVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(RestoreVoucherCommand request, CancellationToken cancellationToken)
        {
            var findVoucher = await context.Vouchers.FindAsync(request.Id);
            if (findVoucher == null)
            {
                throw new NotFoundException("Voucher not found");
            }

            findVoucher.is_deleted = false;

            var result = context.Vouchers.Update(findVoucher);
            await context.SaveChangesAsync(cancellationToken);
            var voucher = mapper.Map<VoucherDto>(result.Entity);
            return voucher;
        }
    }
}