using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos;
using Domain.Exceptions;
using MediatR;


namespace Application.Category.Commands.Delete
{
    public class DeleteCategoryCommand : IRequest<CategoryDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteCategoryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var findCategory = await context.Categories.FindAsync(request.Id);
            if (findCategory == null)
            {
                throw new NotFoundException("Category not found");
            }

            findCategory.is_deleted = true;
            var data = context.Categories.Update(findCategory);
            await context.SaveChangesAsync(cancellationToken);
            var categoryDto = mapper.Map<CategoryDto>(data.Entity);
            return categoryDto;
        }
    }
}