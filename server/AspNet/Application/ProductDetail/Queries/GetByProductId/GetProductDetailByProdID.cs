using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.ProductDetail.Queries.GetByProductId
{
    public class GetProductDetailByProdIDQuery : IRequest<List<ProductDetailDto>>
    {
        public string product_id { get; set; } = null!;
    }
    public class GetProductDetailByProdIDHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetProductDetailByProdIDQuery, List<ProductDetailDto>>
    {
        public async Task<List<ProductDetailDto>> Handle(GetProductDetailByProdIDQuery request, CancellationToken cancellationToken)
        {
            var productDetails = await context.ProductDetails
                .Where(x => x.product_id == request.product_id)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<ProductDetailDto>>(productDetails);
        }
    }
}