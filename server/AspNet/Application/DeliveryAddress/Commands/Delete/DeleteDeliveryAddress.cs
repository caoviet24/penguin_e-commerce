using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.DeliveryAddress.Commands.Delete
{
    public class DeleteDeliveryAddressCommand : IRequest<DeliveryAddressDto>
    {
        public string Id { get; set; } = null!;
    }
    public class DeleteDeliveryAddressCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteDeliveryAddressCommand, DeliveryAddressDto>
    {
        public async Task<DeliveryAddressDto> Handle(DeleteDeliveryAddressCommand request, CancellationToken cancellationToken)
        {
            var checkExitAddress = await context.AddressDeliveries.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (checkExitAddress == null)
            {
                throw new NotFoundException("Delivery address not found.");
            }
            checkExitAddress.is_deleted = true;
            var result = context.AddressDeliveries.Update(checkExitAddress);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<DeliveryAddressDto>(result.Entity);
        }
    }
}