using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.DeliveryAddress.Commands.Create
{
    public class CreateDeliveryAddressCommand : IRequest<DeliveryAddressDto>
    {
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
        public string full_name { get; set; } = null!;
    }

    public class CreateDeliveryAddressCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateDeliveryAddressCommand, DeliveryAddressDto>
    {
        public async Task<DeliveryAddressDto> Handle(CreateDeliveryAddressCommand request, CancellationToken cancellationToken)
        {
            var checkExitAddress = await context.AddressDeliveries.FirstOrDefaultAsync(x => x.address == request.address && x.phone == request.phone && x.full_name == request.full_name, cancellationToken);

            if (checkExitAddress != null)
            {
                checkExitAddress.is_deleted = false;
                var result = context.AddressDeliveries.Update(checkExitAddress);
                await context.SaveChangesAsync(cancellationToken);
                return mapper.Map<DeliveryAddressDto>(result.Entity);
            }

            var newAddress = mapper.Map<AddressDeliveryEntity>(request);
            newAddress.Id = Guid.NewGuid().ToString();
            var data = await context.AddressDeliveries.AddAsync(newAddress, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<DeliveryAddressDto>(data.Entity);

        }
    }
}