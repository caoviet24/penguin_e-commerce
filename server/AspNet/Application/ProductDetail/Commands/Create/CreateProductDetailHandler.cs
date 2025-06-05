using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.ProductDetail.Commands.Create
{
    public class CreateProductDetailCommand2 : IRequest<ProductDetailDto>
    {
        public string product_id { get; set; } = null!;
        public string product_name { get; set; } = null!;
        public string image { get; set; } = null!;
        public double sale_price { get; set; }
        public double promotional_price { get; set; }
        public int stock_quantity { get; set; }
        public string color { get; set; } = null!;
        public List<string> sizes { get; set; } = new List<string>();
    }
    public class CreateProductDetailHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateProductDetailCommand2, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(CreateProductDetailCommand2 request, CancellationToken cancellationToken)
        {
            var checkExitProductDetail = await context.ProductDetails
                .FirstOrDefaultAsync(x => x.product_id == request.product_id && x.product_name == request.product_name, cancellationToken);
            if (checkExitProductDetail != null)
            {
                throw new BadRequestException("Product detail already exists.");
            }
            string _sizes = string.Join(",", request.sizes);

            var newProductDetail = mapper.Map<ProductDetailEntity>(request);
            newProductDetail.Id = Guid.NewGuid().ToString();
            newProductDetail.size = _sizes;

            var data = await context.ProductDetails.AddAsync(newProductDetail, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<ProductDetailDto>(data.Entity);
        }
    }
}