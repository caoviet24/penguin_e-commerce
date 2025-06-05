using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Application.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Application.Category.Queries.GetAll
{
    public class GetAllCategoryQuery : IRequest<List<CategoryDto>>
    {
        public string? search { get; set; } = null;
        public bool? is_deleted { get; set; } = false;
    }

    public class GetAllCategoryQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllCategoryQuery, List<CategoryDto>>
    {
        public async Task<List<CategoryDto>> Handle(GetAllCategoryQuery request, CancellationToken cancellationToken)
        {
            var query = context.Categories.Include(c => c.ListCategoryDetail).AsQueryable();

            if (request.is_deleted != null)
            {
                query = query.Where(c => c.is_deleted == request.is_deleted);
            }

            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(c => c.name.Contains(request.search));
            }

            var totalRecord = await query.CountAsync(cancellationToken);
            var categories = await query
                .ToListAsync(cancellationToken);

            var categoryDtos = mapper.Map<List<CategoryDto>>(categories);
            
            foreach (var category in categoryDtos)
            {
                category.list_category_detail = mapper.Map<List<CategoryDetailDto>>(
                    categories.FirstOrDefault(c => c.Id == category.Id)?.ListCategoryDetail);
            }

            return categoryDtos;
        }   
    }
}