using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.BackBill.Queries
{
    public class GetByBillIdQuery : IRequest<BackBillDto>
    {
        public string Id { get; set; } = null!;
    }

    public class GetByBillIdQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetByBillIdQuery, BackBillDto>
    {
        public async Task<BackBillDto> Handle(GetByBillIdQuery request, CancellationToken cancellationToken)
        {
            var backBillEntity = await context.BackBills
                .Include(b => b.Buyer)
                .FirstOrDefaultAsync(b => b.bill_id == request.Id, cancellationToken);

            if (backBillEntity == null)
            {
                throw new NotFoundException($"BackBill with bill id {request.Id} not found.");
            }

            return mapper.Map<BackBillDto>(backBillEntity);
        }
    }

}