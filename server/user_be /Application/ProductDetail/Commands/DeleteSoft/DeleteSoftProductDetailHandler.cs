using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.ProductDetail.Commands.DeleteSoft
{
    public class DeleteSoftProductDetailCommand : IRequest<ProductDetailDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteSoftProductDetailHandler(IDbHelper dbHelper) : IRequestHandler<DeleteSoftProductDetailCommand, ProductDetailDto>
    {
        public async Task<ProductDetailDto> Handle(DeleteSoftProductDetailCommand request, CancellationToken cancellationToken)
        {
            var productDetail = await dbHelper.QueryProceduceSingleDataAsync<ProductDetailDto>(
                "sp_delete_soft_product_detail",
                new
                {
                    Id = request.Id
                }
            );
            return productDetail;
        }
    }

}