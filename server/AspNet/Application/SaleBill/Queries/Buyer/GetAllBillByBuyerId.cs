using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.SaleBill.Queries.Buyer
{
    public class GetAllBillByBuyerIdQuery : IRequest<List<SaleBillDto>>
    {
        public string buyer_id { get; set; } = null!;
        public string? status { get; set; } = null!;
    }

    public class GetAllBillByBuyerIdQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllBillByBuyerIdQuery, List<SaleBillDto>>
    {
        public async Task<List<SaleBillDto>> Handle(GetAllBillByBuyerIdQuery request, CancellationToken cancellationToken)
        {
            var bills = await context.SaleBills
                .Include(b => b.MyBooth)
                .Include(b => b.AddressDelivery)
                .Include(b => b.BackBill)
                    .ThenInclude(b => b.Buyer)
                .Include(b => b.ListSaleBillDetail)
                    .ThenInclude(d => d.ProductDetail)
                .Where(b => b.created_by == request.buyer_id && (request.status == null || b.status == request.status))
                .ToListAsync(cancellationToken);

            var billsDto = mapper.Map<List<SaleBillDto>>(bills);
         

            return billsDto;
        }
    }
}