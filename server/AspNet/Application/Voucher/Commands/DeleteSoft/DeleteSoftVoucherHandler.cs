using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;


namespace Application.Voucher.Commands.DeleteSoft
{
    public class DeleteSoftVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteSoftVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteSoftVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(DeleteSoftVoucherCommand request, CancellationToken cancellationToken)
        {
            var findVoucher = await context.Vouchers.FindAsync(request.Id);
            if (findVoucher == null)
            {
                throw new NotFoundException("Voucher not found");
            }

            findVoucher.is_deleted = true;

            var result = context.Vouchers.Update(findVoucher);
            await context.SaveChangesAsync(cancellationToken);
            var voucher = mapper.Map<VoucherDto>(result.Entity);
            return voucher;
        }
    }
}