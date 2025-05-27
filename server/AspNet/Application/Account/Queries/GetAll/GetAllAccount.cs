using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Microsoft.EntityFrameworkCore;

namespace Application.Account.Queries.GetAll
{
    public class GetAllAccountQuery : IRequest<ResponDataDto<List<AccountDto>>>
    {
        public int page_number { get; set; } = 1;
        public int page_size { get; set; } = 10;
        public string? search { get; set; }
        public string? role { get; set; }
        public bool? is_deleted { get; set; }
        public bool? is_banned { get; set; }
    }

    public class GetAllAccountHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllAccountQuery, ResponDataDto<List<AccountDto>>>
    {
        public async Task<ResponDataDto<List<AccountDto>>> Handle(GetAllAccountQuery request, CancellationToken cancellationToken)
        {
            var query = context.Accounts.AsQueryable();

            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(x => x.username.Contains(request.search));
            }

            if (!string.IsNullOrEmpty(request.role))
            {
                query = query.Where(x => x.role == request.role);
            }

            if (request.is_deleted.HasValue)
            {
                query = query.Where(x => x.is_deleted == request.is_deleted.Value);
            }

            if (request.is_banned.HasValue)
            {
                query = query.Where(x => x.is_banned == request.is_banned.Value);
            }

            var totalRecords = await query.CountAsync(cancellationToken);


            var accounts = await query
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            var accountDtos = mapper.Map<List<AccountDto>>(accounts);

            return new ResponDataDto<List<AccountDto>>
            {
                data = accountDtos,
                page_number = request.page_number,
                page_size = request.page_size,
                total_record = totalRecords,

            };
        }
    }
}