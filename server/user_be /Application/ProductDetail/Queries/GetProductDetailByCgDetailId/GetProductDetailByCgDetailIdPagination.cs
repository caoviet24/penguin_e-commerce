using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.ProductDetail.Queries.GetProductDetailByCgId
{
    public class GetProductDetailByCgDetailIdQuery : IRequest<ResponDataDto>
    {
        public string cg_detail_id { get; set; } = null!;
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
    public class GetProductDetailByCgDetailIdPagination(IDbConnection dbConnection) : IRequestHandler<GetProductDetailByCgDetailIdQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetProductDetailByCgDetailIdQuery request, CancellationToken cancellationToken)
        {
            var proDetailData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_product_by_cg_detail_id_pagination",
                new
                {
                    cg_detail_id = request.cg_detail_id,
                    page_number = request.page_number,
                    page_size = request.page_size
                },
                commandType: CommandType.StoredProcedure
            );

            var data = proDetailData.Read<ProductDetailDto>().ToList();
            var total = proDetailData.Read<int>().Single();
            return new ResponDataDto()
            {
                data = data,
                page_number = request.page_number,
                page_size = request.page_size,
                total_record = total
            };


        }
    }
}