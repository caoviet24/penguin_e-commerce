using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.ProductDetail.Commands.Restore
{
    
    public class RestoreProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreProductDetailHandler(IDbHelper dbHelper) : IRequestHandler<RestoreProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(RestoreProductDetailCommand request, CancellationToken cancellationToken)
        {
            var productDetail = await dbHelper.QueryProceduceSingleDataAsync<ProductDetailDto>(
                "sp_restore_product_detail",
                new
                {
                    Id = request.Id
                }
            );
            return productDetail;
        }
    }
}