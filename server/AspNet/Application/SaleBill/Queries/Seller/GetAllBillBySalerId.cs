using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.SaleBill.Queries.Seller
{
    public class GetAllBillBySalerIdQuery : IRequest<ResponDataDto<List<SaleBillDto>>>
    {
        public string seller_id { get; set; } = null!;
        public string? status { get; set; } = null!;
        public int page_number { get; set; }
        public int page_size { get; set; }
    }

    public class GetAllBillBySalerIdQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllBillBySalerIdQuery, ResponDataDto<List<SaleBillDto>>>
    {
        public async Task<ResponDataDto<List<SaleBillDto>>> Handle(GetAllBillBySalerIdQuery request, CancellationToken cancellationToken)
        {
            var bills = await context.SaleBills
                .Include(b => b.AddressDelivery)
                    .Include(b => b.BackBill)
                    .ThenInclude(b => b.Buyer)
                .Include(b => b.ListSaleBillDetail)
                    .ThenInclude(d => d.ProductDetail)
                .Where(b => b.booth_id == request.seller_id && (request.status == null || b.status == request.status))
                .OrderByDescending(b => b.created_at)
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            var totalCount = await context.SaleBills
                .CountAsync(b => b.booth_id == request.seller_id && (request.status == null || b.status == request.status), cancellationToken);

            return new ResponDataDto<List<SaleBillDto>>
            {
                data = mapper.Map<List<SaleBillDto>>(bills),
                total_record = totalCount,
                page_number = request.page_number,
                page_size = request.page_size,
            };
        }
    }
}