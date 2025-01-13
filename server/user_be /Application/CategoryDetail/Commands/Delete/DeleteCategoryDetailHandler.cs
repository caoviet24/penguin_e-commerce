using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.CategoryDetail.Commands.Delete
{
    public class DeleteCategoryDetailCommand : IRequest<CategoryDetailDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteCategoryDetailHandler(IDbHelper dbHelper) : IRequestHandler<DeleteCategoryDetailCommand, CategoryDetailDto>
    {
        public async Task<CategoryDetailDto> Handle(DeleteCategoryDetailCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDetailDto>(
                "sp_delete_category_detail",
                new
                {
                    Id = request.Id
                }

            );
            return data;

        }
    }
}