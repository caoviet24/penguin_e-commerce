using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Voucher.Queries.GetWithPagination
{
    public class GetVoucherWithPaginationQuery : IRequest<ResponDataDto<List<VoucherDto>>>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string? search { get; set; }
        public string? code { get; set; }
        public string? type { get; set; }
        public int? status { get; set; }
        public bool? is_deleted { get; set; }

    }

    public class GetAllVoucherHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetVoucherWithPaginationQuery , ResponDataDto<List<VoucherDto>>>
    {
        public async Task<ResponDataDto<List<VoucherDto>>> Handle(GetVoucherWithPaginationQuery request, CancellationToken cancellationToken)
        {
            var query = context.Vouchers.AsQueryable();

            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(v => v.voucher_name.Contains(request.search) || v.voucher_code.Contains(request.search));
            }


            if (!string.IsNullOrEmpty(request.type))
            {
                query = query.Where(v => v.voucher_type == request.type);
            }

            if (request.status.HasValue)
            {
                query = query.Where(v => v.status == request.status.Value);
            }

            if (request.is_deleted.HasValue)
            {
                query = query.Where(v => v.is_deleted == request.is_deleted.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

    

            var vouchers = await query
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            return new ResponDataDto<List<VoucherDto>>
            {
                data = mapper.Map<List<VoucherDto>>(vouchers),
                total_record = totalCount,
                page_number = request.page_number,
                page_size = request.page_size
            };
        }
    }
}