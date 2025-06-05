using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Application.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Application.Category.Queries.GetWithPagination
{
    public class GetCategoryWithPaginationQuery : IRequest<ResponDataDto<List<CategoryDto>>>
    {
        public int page_number { get; set; } = 1;
        public int page_size { get; set; } = 10;
        public string? search { get; set; } = null;
        public bool? is_deleted { get; set; } = false;
    }
    public class GetCategoryWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetCategoryWithPaginationQuery, ResponDataDto<List<CategoryDto>>>
    {
        public async Task<ResponDataDto<List<CategoryDto>>> Handle(GetCategoryWithPaginationQuery request, CancellationToken cancellationToken)
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
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            var categoryDtos = mapper.Map<List<CategoryDto>>(categories);

            foreach (var category in categoryDtos)
            {
                category.list_category_detail = mapper.Map<List<CategoryDetailDto>>(
                    categories.FirstOrDefault(c => c.Id == category.Id)?.ListCategoryDetail);
            }

            return new ResponDataDto<List<CategoryDto>>
            {
                total_record = totalRecord,
                page_number = request.page_number,
                page_size = request.page_size,
                data = categoryDtos
            };
        }
    }
}