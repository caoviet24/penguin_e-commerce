using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Domain.Exceptions;
using MediatR;
using WebApi.DBHelper;

namespace Application.Category.Commands.DeleteCategory
{
    public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand, CategoryDto>
    {
        private readonly IDbHelper _dbHelper;
        public DeleteCategoryHandler(IDbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public async Task<CategoryDto> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var category = await _dbHelper.QueryProceduceByUserAsync<CategoryDto>("sp_delete_category", new Dapper.DynamicParameters(new
                {
                    category_id = request.category_id
                })
                );
                return category;
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }
    }
}