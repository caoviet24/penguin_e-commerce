using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.CategoryDetail.Queries.GetByCategoryId
{
    public class GetCategoryDetailByCgIdQuery : IRequest<List<CategoryDetailDto>>
    {
        public string cg_id { get; set; } = null!;
    }
    public class GetCategoryDetailByCgIdHandler(IDbHelper dbHelper) : IRequestHandler<GetCategoryDetailByCgIdQuery, List<CategoryDetailDto>>
    {
        public async Task<List<CategoryDetailDto>> Handle(GetCategoryDetailByCgIdQuery request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceMultiDataAsync<CategoryDetailDto>(
                "sp_get_category_detail_by_cg_id",
                new
                {
                    cg_id = request.cg_id
                }
                

            );
            return data;
        }
    }
}