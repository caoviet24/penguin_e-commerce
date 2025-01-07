using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Application.Dtos;
using Dapper;
using MediatR;

namespace Application.Category.Queries.GetByNamePagination
{
    public class GetCategoryPaginationByNameQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string category_name { get; set; } = null!;
    }
    public class GetCategoryPaginationByNameHandler(IDbConnection dbConnection) : IRequestHandler<GetCategoryPaginationByNameQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetCategoryPaginationByNameQuery request, CancellationToken cancellationToken)
        {
            var cgData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_category_by_name_pagination",
                new
                {
                    category_name = request.category_name,
                    page_number = request.page_number,
                    page_size = request.page_size
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

    
             return new ResponDataDto()
            {
                data = cgDic.Values.ToList(),
                page_number = request.page_number,
                page_size = request.page_size,
                total_record = cgData.ReadFirst<int>()
            };

        }
    }
}