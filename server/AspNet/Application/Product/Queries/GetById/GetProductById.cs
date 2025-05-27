using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetById
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }

    public class GetProductByIdQueryHandler(IApplicationDbContext context, IMapper  mapper) : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var product = await context.Products.Include(p => p.ListProductDetail).FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                throw new NotFoundException("Product not found.");
            }

            var productDto = mapper.Map<ProductDto>(product);
            productDto.list_product_detail = mapper.Map<List<ProductDetailDto>>(product.ListProductDetail);
            return productDto;  
        }
    }
}