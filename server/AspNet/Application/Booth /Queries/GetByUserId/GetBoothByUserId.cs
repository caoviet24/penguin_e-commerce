using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Booth.Queries.GetByUserId
{
    public class GetBoothByUserIdQuery : IRequest<BoothDto>
    {
        public string user_id { get; set; } = null!;
    }
    public class GetBoothByUserIdQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetBoothByUserIdQuery, BoothDto>
    {
        public async Task<BoothDto> Handle(GetBoothByUserIdQuery request, CancellationToken cancellationToken)
        {
            var booth = await context.Booths
                .Where(x => x.created_by == request.user_id)
                .FirstOrDefaultAsync(cancellationToken);
            if (booth == null)
            {
                throw new NotFoundException("Booth not found for the given user ID.");
            }
            return mapper.Map<BoothDto>(booth);
        }
    }
}