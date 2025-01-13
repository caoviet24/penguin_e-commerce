using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Commands.Restore
{

    public class RestoreProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }
    public class RestoreProductHandler(IDbHelper dbHelper) : IRequestHandler<RestoreProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(RestoreProductCommand request, CancellationToken cancellationToken)
        {
            var product = await dbHelper.QueryProceduceSingleDataAsync<ProductDto>(
                "sp_restore_product_by_id",
                new
                {
                    Id = request.Id
                }
            );

            return product;
        }
    }
}