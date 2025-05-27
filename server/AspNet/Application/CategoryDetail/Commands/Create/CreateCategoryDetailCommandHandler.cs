using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.CategoryDetail.Commands.Create
{
    public class CreateCategoryDetailCommand : IRequest<CategoryDetailDto>
    {
        public string name { get; set; } = null!;
        public string category_id { get; set; } = null!;
    }
    public class CreateCategoryDetailHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateCategoryDetailCommand, CategoryDetailDto>
    {
        public async Task<CategoryDetailDto> Handle(CreateCategoryDetailCommand request, CancellationToken cancellationToken)
        {

            var checkExitCategoryDetail = await context.CategoryDetails.FirstOrDefaultAsync(c => c.name == request.name && c.category_id == request.category_id, cancellationToken);
            if (checkExitCategoryDetail != null)
            {

                if (checkExitCategoryDetail.is_deleted == false)
                {
                    throw new BadRequestException("Category detail already exists.");
                }

                checkExitCategoryDetail.is_deleted = false;
                var result = context.CategoryDetails.Update(checkExitCategoryDetail);
                await context.SaveChangesAsync(cancellationToken);
                return mapper.Map<CategoryDetailDto>(result.Entity);
            }

            var newCategoryDetail = mapper.Map<Domain.Entities.CategoryDetailEntity>(request);
            newCategoryDetail.Id = Guid.NewGuid().ToString();
            newCategoryDetail.created_at = DateTime.UtcNow;
            newCategoryDetail.updated_at = DateTime.UtcNow;
            newCategoryDetail.is_deleted = false;

            var data = await context.CategoryDetails.AddAsync(newCategoryDetail, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<CategoryDetailDto>(data.Entity);


        }
    }
}