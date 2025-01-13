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

namespace Application.Category.Commands.Update
{
   public class UpdateCategoryCommand : IRequest<CategoryDto>
    {
        public string Id { get; set; } = null!;
        public string category_name { get; set; } = null!;
        public string image { get; set; } = null!;
    }

    public class  UpdateCategoryHandler(IDbConnection dbConnection) : IRequestHandler<UpdateCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
        
            var categoryData = await dbConnection.QueryMultipleAsync
            (
                "sp_update_category_by_id",
                new
                {
                    Id = request.Id,
                    cg_name = request.category_name,
                    image = request.image
                }, 
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, CategoryDto> cgDic = new Dictionary<string, CategoryDto>();
            var category = categoryData.Read<CategoryDto, CategoryDetailDto, CategoryDto>
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


            return cgDic.Values.First();
        }


    }
}