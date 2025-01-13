using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Commands.DeleteSoft
{
    public class DeleteSoftProductCommand : IRequest<ProductDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteSoftProductHandler(IDbHelper dbHelper) : IRequestHandler<DeleteSoftProductCommand, ProductDto>
    {
        public async Task<ProductDto> Handle(DeleteSoftProductCommand request, CancellationToken cancellationToken)
        {
            var product = await dbHelper.QueryProceduceSingleDataAsync<ProductDto>(
                "sp_delete_soft_product_by_id",
                new
                {
                    Id = request.Id
                }
            );

            return product;
        }
    }
}