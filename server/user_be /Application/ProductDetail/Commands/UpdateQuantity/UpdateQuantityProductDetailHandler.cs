using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.ProductDetail.Commands.UpdateQuantity
{
    public class UpdateQuantityProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string Id { get; set; } = null!;
        public int stock_quantity { get; set; }
        public int sale_quantity { get; set; }
    }
    public class UpdateQuantityProductDetailHandler(IDbHelper dbHelper) : IRequestHandler<UpdateQuantityProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(UpdateQuantityProductDetailCommand request, CancellationToken cancellationToken)
        {
            var newProductDetail = await dbHelper.QueryProceduceSingleDataAsync<ProductDetailDto>(
                "sp_update_quantity_product_detail_by_id",
                new
                {
                    product_detail_id = request.Id,
                    stock_quantity = request.stock_quantity,
                    sale_quantity = request.sale_quantity,
                }
            );
            return newProductDetail;
        }
    }
}