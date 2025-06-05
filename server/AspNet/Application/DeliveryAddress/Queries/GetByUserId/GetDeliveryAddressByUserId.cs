using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.DeliveryAddress.Queries.GetByUserId
{
    public class GetDeliveryAddressByUserIdQuery : IRequest<List<DeliveryAddressDto>>
    {
        public string user_id { get; set; } = null!;
    }
    public class GetDeliveryAddressByUserIdQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetDeliveryAddressByUserIdQuery, List<DeliveryAddressDto>>
    {

        public async Task<List<DeliveryAddressDto>> Handle(GetDeliveryAddressByUserIdQuery request, CancellationToken cancellationToken)
        {
            var addresses = await context.AddressDeliveries
                .Where(x => x.created_by == request.user_id && !x.is_deleted)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<DeliveryAddressDto>>(addresses);
        }
    }
}