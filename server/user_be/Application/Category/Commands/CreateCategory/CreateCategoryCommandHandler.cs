using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Dtos;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.Category.Commands.CreateCategory
{
    public class CreateCategoryDetail2Command : IRequest<CategoryDetailDto>
    {
        public string category_detail_name { get; set; } = null!;
    }
    public class CreateCategoryCommand : IRequest<CategoryDto>
    {
        public string category_name { get; set; } = null!;
        public List<CreateCategoryDetail2Command> list_category_detail { get; set; } = null!;
    }

    public class CreateCategoryHandler(IDbHelper dbHelper) : IRequestHandler<CreateCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {

                var checkCategoryExit = await dbHelper.QueryProceduceSingleDataAsync<CategoryDto>(
                    "sp_find_category_by_name",
                    new
                    {
                        category_name = request.category_name
                    });

                if (checkCategoryExit?.Id != null)
                {
                    throw new BadRequestException("Category is exist.");
                }


                var newCategory = await dbHelper.QueryProceduceByUserAsync<CategoryDto>(
                    "sp_create_category",
                    new
                    {
                        category_id = Guid.NewGuid().ToString(),
                        category_name = request.category_name,
                    });

                foreach (CreateCategoryDetail2Command cgd2 in request.list_category_detail)
                {
                    var cgd2Data = await dbHelper.QueryProceduceSingleDataAsync<CategoryDetailDto>(
                        "sp_create_category_detail",
                        new
                        {
                            category_detail_id = Guid.NewGuid().ToString(),
                            category_detail_name = cgd2.category_detail_name,
                            created_at = DateTime.Now,
                            updated_at = DateTime.Now,
                            category_id = newCategory.Id
                        });
                    newCategory.list_category_detail.Add(cgd2Data);
                }

                
                return newCategory;
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }
    }
}