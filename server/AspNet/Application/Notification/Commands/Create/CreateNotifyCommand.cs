using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;

namespace Application.Notification.Commands.Create
{
    public class CreateNotifyCommand : IRequest<NotifyDto>
    {
        public string title { get; set; } = null!;
        public string content { get; set; } = null!;
        public string type { get; set; } = null!;
        public string? image { get; set; }
        public string? link { get; set; }
        public string receiver_id { get; set; } = null!;
    }

    public class CreateNotifyCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateNotifyCommand, NotifyDto>
    {

        public async Task<NotifyDto> Handle(CreateNotifyCommand request, CancellationToken cancellationToken)
        {
            var newNotify = mapper.Map<NotifyEntity>(request);

            newNotify.is_read = false;

            var notify = await context.Notifies.AddAsync(newNotify, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            var notifyDto = mapper.Map<NotifyDto>(notify.Entity);
            return notifyDto;
        }
    }
}