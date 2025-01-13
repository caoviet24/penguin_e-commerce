using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

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
    public class CreateProductDetailHandler(IDbHelper dbHelper) : IRequestHandler<CreateProductDetailCommand2, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(CreateProductDetailCommand2 request, CancellationToken cancellationToken)
        {
            string _sizes = string.Join(",", request.sizes);

            var newProductDetail = await dbHelper.QueryProceduceSingleDataAsync<ProductDetailDto>(
                "sp_create_product_detail",
                new
                {
                    product_detail_id = Guid.NewGuid().ToString(),
                    product_name = request.product_name,
                    image = request.image,
                    color = request.color,
                    size = _sizes,
                    sale_price = request.sale_price,
                    promotional_price = request.promotional_price,
                    sale_quantity = 0,
                    stock_quantity = request.stock_quantity,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow,
                    product_id = request.product_id,
                    is_deleted = false
                }
            );
            return newProductDetail;
        }
    }
}