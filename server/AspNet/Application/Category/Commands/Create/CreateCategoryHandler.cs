using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Category.Commands.Create
{
    public class CreateCategoryDetail2Command : IRequest<CategoryDetailDto>
    {
        public string name { get; set; } = null!;
    }
    public class CreateCategoryCommand : IRequest<CategoryDto>
    {
        public string name { get; set; } = null!;
        public string image { get; set; } = null!;
        public List<CreateCategoryDetail2Command> list_category_detail { get; set; } = null!;
    }

    public class CreateCategoryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateCategoryCommand, Application.Dtos.CategoryDto>
    {
        public async Task<Application.Dtos.CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var checkCategoryExit = await context.Categories.FirstOrDefaultAsync(c => c.name == request.name);

            if (checkCategoryExit != null)
            {
                throw new BadRequestException("Category is exist.");
            }

            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var newCategory = mapper.Map<CategoryEntity>(request);
                newCategory.Id = Guid.NewGuid().ToString();
                newCategory.ListCategoryDetail = new List<CategoryDetailEntity>();

                var newCgData = await context.Categories.AddAsync(newCategory, cancellationToken);

                if (request.list_category_detail != null && request.list_category_detail.Count > 0)
                {
                    foreach (var detail in request.list_category_detail)
                    {
                        var newCategoryDetail = new CategoryDetailEntity
                        {
                            Id = Guid.NewGuid().ToString(),
                            name = detail.name,
                            category_id = newCgData.Entity.Id,
                            created_at = DateTime.UtcNow,
                            updated_at = DateTime.UtcNow,
                            is_deleted = false
                        };
                        var item = await context.CategoryDetails.AddAsync(newCategoryDetail, cancellationToken);
                        newCgData.Entity.ListCategoryDetail.Add(item.Entity);
                    }
                }


                // Now we only need to save changes for the category details
                await context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                var categoryDto = mapper.Map<CategoryDto>(newCgData.Entity);
                categoryDto.list_category_detail = mapper.Map<List<CategoryDetailDto>>(newCategory.ListCategoryDetail);

                return categoryDto;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

    }
}