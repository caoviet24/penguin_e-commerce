using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Domain.Enums;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

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
    public class CreateProductHandler(IDbHelper dbHelper) : IRequestHandler<CreateProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {

            var newProduct = await dbHelper.QueryProceduceSingleDataAsync<ProductDto>(
                "sp_create_product",
                new
                {
                    product_id = Guid.NewGuid().ToString(),
                    product_desc = request.product_desc,
                    status = StatusProduct.Inactive,
                    category_detail_id = request.category_detail_id,
                    created_at = DateTime.UtcNow,
                    booth_id = request.booth_id,
                    last_updated = DateTime.UtcNow,
                    updated_by = request.booth_id,
                    is_deleted = false
                }
            );

            if (newProduct == null)
            {
                throw new BadRequestException("Create product failed.");
            }

            foreach (var item in request.list_product_detail)
            {


                string _sizes = string.Join(",", item.sizes);

                var newProductDetail = await dbHelper.QueryProceduceSingleDataAsync<ProductDetailDto>(
                    "sp_create_product_detail",
                    new
                    {
                        product_detail_id = Guid.NewGuid().ToString(),
                        product_name = item.product_name,
                        image = item.image,
                        color = item.color,
                        size = _sizes,
                        sale_price = item.sale_price,
                        promotional_price = item.promotional_price,
                        sale_quantity = 0,
                        stock_quantity = item.stock_quantity,
                        created_at = DateTime.UtcNow,
                        updated_at = DateTime.UtcNow,
                        product_id = newProduct.Id,
                        is_deleted = false
                    }
                );
                newProduct.list_product_detail.Add(newProductDetail);
            }

            return newProduct;

        }
    }

}