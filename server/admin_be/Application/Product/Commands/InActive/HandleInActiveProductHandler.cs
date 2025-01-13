using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Commands.InActive
{
    public class InActiveProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }
    public class InActiveProductHandler(IDbHelper dbHelper) : IRequestHandler<InActiveProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(InActiveProductCommand request, CancellationToken cancellationToken)
        {
            var product = await dbHelper.QueryProceduceSingleDataAsync<ProductDto>(
                "sp_inactive_product_by_id",
                new
                {
                    Id = request.Id
                }
            );

            return product;
        }
    }
}