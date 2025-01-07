using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.Product.Queries.GetByDesc
{
    public class GetProductByDescPaginationQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string product_desc { get; set; } = null!;
    }
    public class GetProductByDescPaginationHandler(IDbConnection dbConnection) : IRequestHandler<GetProductByDescPaginationQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetProductByDescPaginationQuery request, CancellationToken cancellationToken)
        {
            var proData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_products_by_desc_pagination",
                new
                {
                    product_desc = request.product_desc,
                    page_number = request.page_number,
                    page_size = request.page_size
                },
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, ProductDto> proDic = new Dictionary<string, ProductDto>();
            proData.Read<ProductDto, ProductDetailDto, ProductDto>
            (
                (pro, prod) =>
                {
                    if (!proDic.TryGetValue(pro.Id, out ProductDto proEntry))
                    {
                        proEntry = pro;
                        proDic.Add(proEntry.Id, proEntry);
                    }

                    if (prod.product_id != null)
                    {
                        proEntry.list_product_detail.Add(prod);
                    }
                    return proEntry;
                },
                splitOn: "product_id"
            );

            var data = proDic.Values.ToList();
            var total = proData.Read<int>().FirstOrDefault();

            return new ResponDataDto
            {
                total_record = total,
                page_number = request.page_number,
                page_size = request.page_size,
                data = data
            };

        }
    }
}