using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Application.Notification.Queries.GetByUserId
{
    public class GetNofityByUserIdQuery : IRequest<List<NotifyDto>>
    {
        
    }

    public class GetNofityByUserIdQueryHandler(IApplicationDbContext context, IMapper mapper, IUser user) : IRequestHandler<GetNofityByUserIdQuery, List<NotifyDto>>
    {
        public async Task<List<NotifyDto>> Handle(GetNofityByUserIdQuery request, CancellationToken cancellationToken)
        {
            var notifyList = await context.Notifies
                .Where(x => x.receiver_id == user.getCurrentUser())
                .OrderByDescending(x => x.created_at)
                .ToListAsync(cancellationToken);
            var notifyDtoList = mapper.Map<List<NotifyDto>>(notifyList);
            return notifyDtoList;
        }
    }
}