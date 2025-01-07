using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Dtos;
using Dapper;
using MediatR;
using WebApi.DBHelper;

namespace Application.Category.Queries.GetCategoryById
{
    public class GetCategoryByIdQuery : IRequest<CategoryDto>
    {
        public string category_id { get; set; } = null!;
    }
    public class GetCategoryByIdHandler(IDbConnection dbConnection) : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
    {
        public async Task<CategoryDto> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var cgData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_category_by_id",
                new
                {
                    category_id = request.category_id
                },
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, CategoryDto> cgDic = new Dictionary<string, CategoryDto>();
            var category = cgData.Read<CategoryDto, CategoryDetailDto, CategoryDto>
            (
                (cg, cgd) => {
                    if(!cgDic.TryGetValue(cg.Id, out var cgEntry))
                    {
                        cgEntry = cg;
                        cgEntry.list_category_detail = new List<CategoryDetailDto>();
                        cgDic.Add(cgEntry.Id, cgEntry);
                    }

                    if(cgd.category_id != null)
                    {
                        cgEntry.list_category_detail.Add(cgd);
                    }

                    return cgEntry;
                },
                splitOn: "category_id"
            );

            return category.First();
        }
    }
}