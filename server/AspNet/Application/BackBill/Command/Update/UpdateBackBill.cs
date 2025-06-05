using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.BackBill.Command.Update
{
    public class UpdateBackBillCommand : IRequest<BackBillDto>
    {
        public string Id { get; set; } = null!;
        public string? reason_back { get; set; } = null!;
        public string? video { get; set; } = null!;
        public string? image { get; set; }
        public string? reply_content { get; set; }
        public string? reply_image { get; set; }
        public string? reply_video { get; set; }
    }
    public class UpdateBackBillCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateBackBillCommand, BackBillDto>
    {
        public async Task<BackBillDto> Handle(UpdateBackBillCommand request, CancellationToken cancellationToken)
        {
            var backBillEntity = await context.BackBills.FindAsync(request.Id, cancellationToken);
            if (backBillEntity == null)
            {
                throw new NotFoundException($"BackBill with id {request.Id} not found.");
            }

            var updateBackBill = mapper.Map<BackBillEntity>(request);

            var result = context.BackBills.Update(updateBackBill);

            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<BackBillDto>(backBillEntity);
        }

    }
}