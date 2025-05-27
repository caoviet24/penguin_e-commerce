using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.CategoryDetail.Commands.Update
{
    public class UpdateCategoryDetailCommand : IRequest<CategoryDetailDto>
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string category_id { get; set; } = null!;
    }

    public class UpdateCategoryDetailCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateCategoryDetailCommand, CategoryDetailDto>
    {

        public async Task<CategoryDetailDto> Handle(UpdateCategoryDetailCommand request, CancellationToken cancellationToken)
        {
            var checkCategoryDetail = await context.CategoryDetails.FindAsync(request.Id);
            if (checkCategoryDetail == null)
            {
                throw new NotFoundException("Category detail not found.");
            }

            var checkExitNameCgDetail = await context.CategoryDetails
                .Where(x => x.name == request.name && x.Id != request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (checkExitNameCgDetail != null)
            {
                throw new BadRequestException("Category detail name already exists.");
            }

            var updateCategoryDetail = mapper.Map<CategoryDetailEntity>(request);

            var result = context.CategoryDetails.Update(updateCategoryDetail);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<CategoryDetailDto>(result.Entity);


        }
    }
}