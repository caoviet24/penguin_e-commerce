using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Commands.Active
{
    public class ActiveProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }
    public class ActiveProductHandler(IDbHelper dbHelper) : IRequestHandler<ActiveProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(ActiveProductCommand request, CancellationToken cancellationToken)
        {
            var product = await dbHelper.QueryProceduceSingleDataAsync<ProductDto>(
                "sp_active_product_by_id",
                new
                {
                    Id = request.Id
                }
            );

            return product;
        }
    }
}