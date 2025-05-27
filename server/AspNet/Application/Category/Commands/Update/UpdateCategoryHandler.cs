using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Application.Dtos;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Category.Commands.Update
{
    public class UpdateCategoryCommand : IRequest<CategoryDto>
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string image { get; set; } = null!;
    }

    public class UpdateCategoryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateCategoryCommand, CategoryDto>
    {
        public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await context.Categories
                .Include(c => c.ListCategoryDetail)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (category == null)
            {
                throw new NotFoundException("Category not found");
            }

            category.name = request.name;
            category.image = request.image;

            context.Categories.Update(category);
            await context.SaveChangesAsync(cancellationToken);

            var categoryDto = mapper.Map<CategoryDto>(category);
            categoryDto.list_category_detail = mapper.Map<List<CategoryDetailDto>>(category.ListCategoryDetail);

            return categoryDto;
        }
    }
}