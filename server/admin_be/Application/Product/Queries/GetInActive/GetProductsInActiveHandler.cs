using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.Product.Queries.GetInActive
{
     public class GetProductsInActiveQuery : IRequest<ResponDataDto>
    {
        public int page_size { get; set; }
        public int page_number { get; set; }
    }
    public class GetProductsInActiveQueryHandler(IDbConnection dbConnection) : IRequestHandler<GetProductsInActiveQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetProductsInActiveQuery request, CancellationToken cancellationToken)
        {
            var productData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_products_inactive_pagination",
                new
                {
                    page_number = request.page_number,
                    page_size = request.page_size
                },
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, ProductDto> productDic = new Dictionary<string, ProductDto>();

            var product = productData.Read<ProductDto, ProductDetailDto, ProductDto>
            (
                (p, pd) =>
                {
                    if (!productDic.TryGetValue(p.Id, out var pEntry))
                    {
                        pEntry = p;
                        pEntry.list_product_detail = new List<ProductDetailDto>();
                        productDic.Add(pEntry.Id, pEntry);
                    }

                    if (pd.product_id != null)
                    {
                        pEntry.list_product_detail.Add(pd);
                    }

                    return pEntry;
                },
                splitOn: "product_id"
            );

            return new ResponDataDto()
            {
                data = productDic.Values.ToList(),
                page_number = request.page_number,
                page_size = request.page_size,
                total_record = productData.ReadFirst<int>()
            };
        }
    }
}