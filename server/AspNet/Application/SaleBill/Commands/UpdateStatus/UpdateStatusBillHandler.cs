using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Dapper;
using Domain.Exceptions;
using MediatR;

namespace Application.SaleBill.Commands.UpdateStatus
{
    public class UpdateStatusBillCommand : IRequest<SaleBillDto>
    {
        public string id { get; set; } = null!;
        public string status { get; set; } = null!;
    }
    public class UpdateStatusBillHandler(IApplicationDbContext context, IMapper  mapper) : IRequestHandler<UpdateStatusBillCommand, SaleBillDto>
    {
        public async Task<SaleBillDto> Handle(UpdateStatusBillCommand request, CancellationToken cancellationToken)
        {
            var billEntity = await context.SaleBills.FindAsync(request.id, cancellationToken);
            if (billEntity == null)
            {
                throw new NotFoundException($"SaleBill with id {request.id} not found.");  
            }

            billEntity.status = request.status;
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<SaleBillDto>(billEntity);
        }
    }
}