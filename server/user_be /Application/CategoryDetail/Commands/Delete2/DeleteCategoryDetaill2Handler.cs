using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using MediatR;
using WebApi.DBHelper;
using Application.Common.Dtos;

namespace Application.CategoryDetail.Commands.Delete
{
    public class DeleteCategoryDetail2Command : IRequest<CategoryDetailDto>
    {
        public string id { get; set; } = null!;
    }
    public class DeleteCategoryDetail2Handler(IDbHelper dbHelper) : IRequestHandler<DeleteCategoryDetail2Command, CategoryDetailDto>
    {
        public async Task<CategoryDetailDto> Handle(DeleteCategoryDetail2Command request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDetailDto>(
                "sp_delete_category_detail_2",
                new
                {
                    Id = request.id
                }

            );
            return data;

        }
    }
}
