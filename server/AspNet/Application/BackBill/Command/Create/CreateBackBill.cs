using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Events;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.BackBill.Command.Create
{
    public class CreateBackBillCommand : IRequest<BackBillDto>
    {
        public string bill_id { get; set; } = null!;
        public string reason_back { get; set; } = null!;
        public string? video { get; set; } = null!;
        public string? image { get; set; }
        public string booth_id { get; set; } = null!;
    }

    public class CreateBackBillCommandHandler(IApplicationDbContext context, IMapper mapper, IUser user, IMediator mediator) : IRequestHandler<CreateBackBillCommand, BackBillDto>
    {
        public async Task<BackBillDto> Handle(CreateBackBillCommand request, CancellationToken cancellationToken)
        {
            var checkExitBackBill = await context.BackBills
                .FirstOrDefaultAsync(b => b.bill_id == request.bill_id, cancellationToken);

            if (checkExitBackBill != null)
            {
                throw new BadRequestException($"Yêu cầu hoàn trả đã được tạo");
            }


            var newBackBill = mapper.Map<BackBillEntity>(request);
            newBackBill.Id = Guid.NewGuid().ToString();
            var data = await context.BackBills.AddAsync(newBackBill, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);



            var buyer = await context.Accounts.FindAsync(user.getCurrentUser(), cancellationToken);
            var checkBill = await context.SaleBills
                .FirstOrDefaultAsync(b => b.Id == request.bill_id, cancellationToken);

            var salerofBooth = await context.Accounts.Include(a => a.Booth)
                .FirstOrDefaultAsync(a => a.Booth.Id == request.booth_id, cancellationToken);

            var returnOrderEvent = new ReturnOrderEvent(
                saler: salerofBooth?.email ?? "Unknown",
                bill: checkBill ?? throw new BadRequestException("Bill not found"),
                booth: salerofBooth?.Booth ?? throw new BadRequestException("Booth not found"),
                user: buyer ?? throw new BadRequestException("User not found")
            );
            await mediator.Publish(returnOrderEvent, cancellationToken);


            return mapper.Map<BackBillDto>(data.Entity);
        }
    }

}