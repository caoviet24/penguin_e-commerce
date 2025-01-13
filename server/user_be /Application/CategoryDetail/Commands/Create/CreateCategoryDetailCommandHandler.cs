using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.CategoryDetail.Commands.Create
{
    public class CreateCategoryDetailCommand : IRequest<CategoryDetailDto>
    {
        public string category_detail_name { get; set; } = null!;
        public string category_id { get; set; } = null!;
    }
    public class CreateCategoryDetailHandler(IDbHelper dbHelper) : IRequestHandler<CreateCategoryDetailCommand, CategoryDetailDto>
    {
        public async Task<CategoryDetailDto> Handle(CreateCategoryDetailCommand request, CancellationToken cancellationToken)
        {

            var data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDetailDto>(
                "sp_create_category_detail",
                new
                {
                    category_detail_id = Guid.NewGuid().ToString(),
                    category_detail_name = request.category_detail_name,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow,
                    category_id = request.category_id
                }

            );
            return data;

        }
    }
}