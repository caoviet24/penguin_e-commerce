using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.DeliveryAddress.Commands.Update
{
    public class UpdateDeliveryAddressCommand : IRequest<DeliveryAddressDto>
    {
        public string Id { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
        public string full_name { get; set; } = null!;
    }

    public class UpdateDeliveryAddressCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateDeliveryAddressCommand, DeliveryAddressDto>
    {
        public async Task<DeliveryAddressDto> Handle(UpdateDeliveryAddressCommand request, CancellationToken cancellationToken)
        {
            var checkExitAddress = await context.AddressDeliveries.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (checkExitAddress == null)
            {
                throw new NotFoundException("Delivery address not found.");
            }

            var updateAddress = mapper.Map<AddressDeliveryEntity>(request);


            var result = context.AddressDeliveries.Update(updateAddress);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<DeliveryAddressDto>(result.Entity);
        }
    }
}