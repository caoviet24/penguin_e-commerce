using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.CategoryDetail.Commands.Restore
{
  public class RestoreCategoryDetailCommand : IRequest<CategoryDetailDto>
    {
        public string id { get; set; } = null!;
    }
    public class RestoreCategoryDetailHandler(IDbHelper dbHelper) : IRequestHandler<RestoreCategoryDetailCommand, CategoryDetailDto>
    {
        public async Task<CategoryDetailDto> Handle(RestoreCategoryDetailCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDetailDto>(
                "sp_restore_category_detail",
                new
                {
                    Id = request.id
                }

            );
            return data;

        }
    }
}