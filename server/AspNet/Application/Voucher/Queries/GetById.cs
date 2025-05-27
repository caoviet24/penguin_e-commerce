using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Voucher.Queries
{
    public class GetVoucherByIdQuery : IRequest<VoucherDto>
    {
        public string voucher_id { get; set; } = null!;
    }
    public class GetVoucherByIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetVoucherByIdQuery, VoucherDto>
    {
        public async Task<VoucherDto> Handle(GetVoucherByIdQuery request, CancellationToken cancellationToken)
        {
            var voucher = await context.Vouchers
                .FirstOrDefaultAsync(v => v.Id == request.voucher_id, cancellationToken);

            if (voucher == null)
            {
                throw new NotFoundException($"Voucher with id {request.voucher_id} not found.");
            }

            return mapper.Map<VoucherDto>(voucher);
        }
    }
}