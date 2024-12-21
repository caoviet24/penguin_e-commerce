using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Queries.GetProductById
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public string product_id { get; set; } = null!;
    }
    public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        private readonly IDbHelper _dbHelper;
        public GetProductByIdHandler(IDbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var product = await _dbHelper.QueryProceduceByUserAsync<ProductDto>(
                    "sp_create_product",
                     new Dapper.DynamicParameters(
                        new
                        {
                            product_id = request.product_id,
                        })
                );

                return product;
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }
    }

}