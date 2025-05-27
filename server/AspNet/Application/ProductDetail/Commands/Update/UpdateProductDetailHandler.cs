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


namespace Application.ProductDetail.Commands.Update
{
    public class UpdateProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string product_detail_id { get; set; } = null!;
        public string product_name { get; set; } = null!;
        public string image { get; set; } = null!;
        public double sale_price { get; set; }
        public double promotional_price { get; set; }
        public int stock_quantity { get; set; }
        public string color { get; set; } = null!;
        public List<string> sizes { get; set; } = new List<string>();

    }
    public class UpdateProductDetailHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(UpdateProductDetailCommand request, CancellationToken cancellationToken)
        {
             var checkExitProductDetail = await context.ProductDetails
                .FirstOrDefaultAsync(x => x.Id == request.product_detail_id, cancellationToken);
            if (checkExitProductDetail == null)
            {
                throw new BadRequestException("Product detail already exists.");
            }
            string _sizes = string.Join(",", request.sizes);

            var newProductDetail = mapper.Map<ProductDetailEntity>(request);
            newProductDetail.size = _sizes;

            context.ProductDetails.Update(newProductDetail);
            return mapper.Map<ProductDetailDto>(newProductDetail);
        }
    }
}