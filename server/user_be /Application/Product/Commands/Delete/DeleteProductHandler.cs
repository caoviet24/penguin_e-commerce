using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Commands.Delete
{
    public class DeleteProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; }
    }
    public class DeleteProductHandler(IDbHelper dbHelper) : IRequestHandler<DeleteProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await dbHelper.QueryProceduceSingleDataAsync<ProductDto>(
                "sp_delete_product_by_id",
                new
                {
                    Id = request.Id
                }
            );

            return product;
        }
    }
}