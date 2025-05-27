using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Enums.status;
using Microsoft.EntityFrameworkCore;

namespace Application.Voucher.Queries.GetAll
{
    public class GetAllVoucherQuery : IRequest<List<VoucherDto>>
    {

    }
    
    public class GetAllVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllVoucherQuery, List<VoucherDto>>
    {
        public async Task<List<VoucherDto>> Handle(GetAllVoucherQuery request, CancellationToken cancellationToken)
        {
            var vouchers = await context.Vouchers
                .Where(v => v.is_deleted == false && v.status == (int)StatusVoucher.ACTIVE)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<VoucherDto>>(vouchers);
        }
    }
}