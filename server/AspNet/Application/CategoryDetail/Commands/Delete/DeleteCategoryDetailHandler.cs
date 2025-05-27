using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.CategoryDetail.Commands.Delete
{
    public class DeleteCategoryDetailCommand : IRequest<CategoryDetailDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteCategoryDetailHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteCategoryDetailCommand, CategoryDetailDto>
    {
        public async Task<CategoryDetailDto> Handle(DeleteCategoryDetailCommand request, CancellationToken cancellationToken)
        {
            var checkExitCategoryDetail = await context.CategoryDetails.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
            if (checkExitCategoryDetail == null)
            {
                throw new NotFoundException("Category detail not exists");
            }

            checkExitCategoryDetail.is_deleted = true;
            var data = context.CategoryDetails.Update(checkExitCategoryDetail);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<CategoryDetailDto>(data.Entity);

        }
    }
}