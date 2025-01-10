using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.Category.Commands.Delete
{
    public class DeleteCategoryCommand : IRequest<CategoryDto>
    {
        public string Id { get; set; } = null!;   
    }
    public class DeleteCategoryHandler(IDbHelper dbHelper) : IRequestHandler<DeleteCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDto>(
                "sp_delete_category_by_id",
                new
                {
                    Id = request.Id
                }

            );
            return data;
        }
    }
}