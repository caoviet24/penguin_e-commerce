using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Category.Commands.Restore
{
     public class RestoreCategoryCommand : IRequest<CategoryDto>
    {
        public string id { get; set; } = null!;   
    }
    public class DeleteCategoryHandler(IDbHelper dbHelper) : IRequestHandler<RestoreCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(RestoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDto>(
                "sp_restore_category_by_id",
                new
                {
                    Id = request.id
                }

            );
            return data;
        }
    }
}