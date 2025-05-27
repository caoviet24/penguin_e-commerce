using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Enums.status;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Voucher.Commands.Active
{
    public class ActiveVoucherCommand : IRequest<VoucherDto>
    {
        public string Id { get; set; } = null!;
    }
    public class ActiveVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<ActiveVoucherCommand, VoucherDto>
    {
        public async Task<VoucherDto> Handle(ActiveVoucherCommand request, CancellationToken cancellationToken)
        {
            var checkExitVoucher = await context.Vouchers
                .Where(x => x.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (checkExitVoucher == null)
            {
                throw new Exception("Voucher not found");
            }

            if ((StatusVoucher)checkExitVoucher.status == StatusVoucher.ACTIVE)
            {
                throw new Exception("Voucher already active");
            }

            checkExitVoucher.status = (int)StatusVoucher.ACTIVE;
            context.Vouchers.Update(checkExitVoucher);
            await context.SaveChangesAsync(cancellationToken);
            var voucherDto = mapper.Map<VoucherDto>(checkExitVoucher);
            return voucherDto;


        }
    }
}