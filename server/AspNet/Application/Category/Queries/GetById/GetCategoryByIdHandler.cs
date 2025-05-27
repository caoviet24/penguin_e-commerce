using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Application.Dtos;
using Dapper;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Category.Queries.GetCategoryById
{
    public class GetCategoryByIdQuery : IRequest<CategoryDto>
    {
        public string category_id { get; set; } = null!;
    }
    public class GetCategoryByIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
    {
        public async Task<CategoryDto> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var data = await context.Categories.Include(c => c.ListCategoryDetail)
                                    .FirstOrDefaultAsync(c => c.Id == request.category_id, cancellationToken);
        

            if (data == null)
            {
                throw new NotFoundException($"Category with ID {request.category_id} not found.");
            }

            var categoryDetail = mapper.Map<List<CategoryDetailDto>>(data.ListCategoryDetail);

            var categoryDto = mapper.Map<CategoryDto>(data);
            categoryDto.list_category_detail = categoryDetail;
            

            return categoryDto;
        }
    }
}