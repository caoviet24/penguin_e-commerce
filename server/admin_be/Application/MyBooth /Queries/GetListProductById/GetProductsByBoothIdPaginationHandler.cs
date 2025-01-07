using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.MyBooth .Queries.GetListProductById
{
    public class GetProductsByBoothIdPaginationQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string id { get; set; } = null!;
    }
    public class GetProductsByBoothIdPaginationHandler(IDbConnection dbConnection) : IRequestHandler<GetProductsByBoothIdPaginationQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetProductsByBoothIdPaginationQuery request, CancellationToken cancellationToken)
        {
            var proData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_products_by_booth_id_pagination",
                new
                {
                    id = request.id,
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
            
            return new ResponDataDto
            {
                total_record = proData.Read<int>().FirstOrDefault(),
                page_number = request.page_number,
                page_size = request.page_size,
                data = proDic.Values.ToList()
            };
        }
    }
}