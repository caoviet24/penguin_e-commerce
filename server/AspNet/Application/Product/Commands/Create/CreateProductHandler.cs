using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Enums.status;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Product.Create
{
    public class CreateProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string product_name { get; set; } = null!;
        public string image { get; set; } = null!;
        public double sale_price { get; set; }
        public double promotional_price { get; set; }
        public int stock_quantity { get; set; }
        public string color { get; set; } = null!;
        public List<string> sizes { get; set; } = new List<string>();
    }
    public class CreateProductCommand : IRequest<ProductDto>
    {
        public string booth_id { get; set; } = null!;
        public string product_desc { get; set; } = null!;
        public string category_detail_id { get; set; } = null!;
        public List<CreateProductDetailCommand> list_product_detail { get; set; } = new List<CreateProductDetailCommand>();
    }
    public class CreateProductHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var checkExitProduct = await context.Products
                .FirstOrDefaultAsync(x => x.created_by == request.booth_id && x.product_desc == request.product_desc, cancellationToken);

            if (checkExitProduct != null)
            {
                throw new BadRequestException("Sản phẩm đã tồn tại.");
            }
    
            var checkExitBooth = await context.Booths
                .FirstOrDefaultAsync(x => x.Id == request.booth_id && x.is_active == true, cancellationToken);

            if (checkExitBooth == null)
            {
                throw new BadRequestException("Cửa hàng không tồn tại hoặc không hoạt động.");
            }

            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var newProduct = mapper.Map<ProductEntity>(request);
                newProduct.Id = Guid.NewGuid().ToString();
                newProduct.created_by = request.booth_id;
                newProduct.created_at = DateTime.UtcNow;
                newProduct.is_active = false;

                var result = await context.Products.AddAsync(newProduct, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
                foreach (var item in request.list_product_detail)
                {
                    var productDetail = mapper.Map<ProductDetailEntity>(item);

                    productDetail.Id = Guid.NewGuid().ToString();
                    productDetail.product_id = result.Entity.Id;
                    productDetail.size = string.Join(",", item.sizes);

                    var resultDetail = await context.ProductDetails.AddAsync(productDetail, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                    newProduct.ListProductDetail.Add(resultDetail.Entity);
                    

                }
                await transaction.CommitAsync(cancellationToken);

                var productDto = mapper.Map<ProductDto>(newProduct);
                productDto.list_product_detail = mapper.Map<List<ProductDetailDto>>(newProduct.ListProductDetail);

                return productDto;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                throw new Exception("Error creating product: " + ex.Message);
            }
        }
    }

}