using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

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
    public class UpdateProductDetailHandler(IDbHelper dbHelper) : IRequestHandler<UpdateProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(UpdateProductDetailCommand request, CancellationToken cancellationToken)
        {
            string _sizes = string.Join(",", request.sizes);

            var newProductDetail = await dbHelper.QueryProceduceSingleDataAsync<ProductDetailDto>(
                "sp_update_product_detail_by_id",
                new
                {
                    product_detail_id = request.product_detail_id,
                    product_name = request.product_name,
                    image = request.image,
                    color = request.color,
                    size = _sizes,
                    sale_price = request.sale_price,
                    promotional_price = request.promotional_price,
                    stock_quantity = request.stock_quantity,
                    updated_at = DateTime.UtcNow,
                }
            );
            return newProductDetail;
        }
    }
}