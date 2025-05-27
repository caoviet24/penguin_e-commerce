using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos;
using Domain.Exceptions;
using MediatR;


namespace Application.Category.Commands.Restore
{
    public class RestoreCategoryCommand : IRequest<CategoryDto>
    {
        public string id { get; set; } = null!;
    }
    public class DeleteCategoryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<RestoreCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(RestoreCategoryCommand request, CancellationToken cancellationToken)
        {
            var findCategory = await context.Categories.FindAsync(request.id);
            if (findCategory == null)
            {
                throw new NotFoundException("Category not found");
            }

            findCategory.is_deleted = false;

            var data = context.Categories.Update(findCategory);
            await context.SaveChangesAsync(cancellationToken);
            var categoryDto = mapper.Map<CategoryDto>(data.Entity);
            return categoryDto;
        }
    }
}