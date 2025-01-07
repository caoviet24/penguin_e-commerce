using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.Product.Queries.GetProductById
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public string product_id { get; set; } = null!;
    }
    public class GetProductByIdHandler(IDbConnection dbConnection) : IRequestHandler<GetProductByIdQuery, ProductDto>
    {
        public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {

            var productData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_product_by_id",
                new
                {
                    product_id = request.product_id,
                },
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, ProductDto> productDic = new Dictionary<string, ProductDto>();

            var product = productData.Read<ProductDto, ProductDetailDto, ProductDto>
            (
                (pro, prod) =>
                {
                    if (!productDic.TryGetValue(pro.Id, out var proEntry))
                    {
                        proEntry = pro;
                        productDic.Add(proEntry.Id, proEntry);
                    }

                    if (prod.product_id != null)
                    {
                        proEntry.list_product_detail.Add(prod);
                    }
                    return proEntry;
                },
                splitOn: "product_id"
            );

            return productDic.Values.First();




        }
    }

}