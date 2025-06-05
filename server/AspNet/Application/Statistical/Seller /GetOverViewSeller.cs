using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Enums.status;
using Microsoft.EntityFrameworkCore;

namespace Application.Statistical.Seller
{
    public class GetOverViewSeller : IRequest<OverViewDto>
    {
        public string seller_id { get; set; } = null!;
    }

    public class GetOverViewSellerHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetOverViewSeller, OverViewDto>
    {
        public async Task<OverViewDto> Handle(GetOverViewSeller request, CancellationToken cancellationToken)
        {
            var totalBillPendingTask = await context.SaleBills
                                        .Where(b =>
                                            b.booth_id == request.seller_id &&
                                            b.status == nameof(StatusBillSale.PENDING))
                                        .CountAsync();
            var totalBillSuccessTask = await context.SaleBills
                                        .Where(b =>
                                            b.booth_id == request.seller_id &&
                                            b.status == nameof(StatusBillSale.DELIVERED))
                                        .CountAsync();
           var totalBillReturnBackPendingTask = await context.SaleBills
                                        .Where(b =>
                                            b.booth_id == request.seller_id &&
                                            b.status == nameof(StatusBillSale.USER_BACK_PENDING))
                                        .CountAsync();

            var totalProductInActiveTask = await context.Products.Where(p => p.created_by == request.seller_id && p.is_active == false).CountAsync();
            var totalProductActiveTask = await context.Products.Where(p => p.created_by == request.seller_id && p.is_active == true).CountAsync();
            var totalProductUnavailable = await context.Products.Where(p => p.created_by == request.seller_id && p.status == "UNAVAILABLE").CountAsync();


            var result = new OverViewDto
            {
                total_bill_pending = totalBillPendingTask,
                total_bill_success = totalBillSuccessTask,
                total_bill_back_pending = totalBillReturnBackPendingTask,
                product_count_active = totalProductActiveTask,
                product_count_inactive = totalProductInActiveTask,
                product_count_unavailable = totalProductUnavailable
            };
            return result;


        }
    }
}