using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.MyBooth.Queries.GetAll
{
    public class GetAllBoothQuery : IRequest<ResponDataDto<List<BoothDto>>>
    {
        public int page_size { get; set; } = 10;
        public int page_number { get; set; } = 1;
        public string? search { get; set; }
        public string? owner_id { get; set; }
        public bool? is_banned { get; set; }
        public bool? is_deleted { get; set; }
        public bool? is_active { get; set; }
    }

    public class GetAllBoothQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllBoothQuery, ResponDataDto<List<BoothDto>>>
    {
        public async Task<ResponDataDto<List<BoothDto>>> Handle(GetAllBoothQuery request, CancellationToken cancellationToken)
        {
            var query = context.Booths.AsQueryable();

            if (request.is_deleted.HasValue)
            {
                query = query.Where(c => c.is_deleted == request.is_deleted.Value);
            }

            if (request.is_banned.HasValue)
            {
                query = query.Where(b => b.is_banned == request.is_banned.Value);
            }

            if (request.is_active.HasValue)
            {
                query = query.Where(b => b.is_active == request.is_active.Value);
            }

            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(c => c.name.Contains(request.search));
            }

            if (!string.IsNullOrEmpty(request.owner_id))
            {
                query = query.Where(b => b.Account.full_name.Contains(request.owner_id) ||
                                        b.Account.username.Contains(request.owner_id));
            }
            
            var totalRecord = await query.CountAsync(cancellationToken);
            var booths = await query
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            var categoryDtos = mapper.Map<List<BoothDto>>(booths);

            return new ResponDataDto<List<BoothDto>>
            {
                total_record = totalRecord,
                page_number = request.page_number,
                page_size = request.page_size,
                data = categoryDtos
            };
        }
    }
}