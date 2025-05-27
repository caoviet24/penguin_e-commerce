using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.OrderItem.Queries.GetByUserId
{
    public class GetOrderItemByUserIdQuery : IRequest<List<OrderItemDto>>
    {
        public string user_id { get; set; } = null!;
    }

    public class GetOrderItemByUserIdQueryValidator : AbstractValidator<GetOrderItemByUserIdQuery>
    {
        public GetOrderItemByUserIdQueryValidator()
        {
            RuleFor(x => x.user_id)
                .NotEmpty()
                .WithMessage("User ID is required.");
        }
    }
    public class GetOrderItemByUserIdQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetOrderItemByUserIdQuery, List<OrderItemDto>>
    {
        public async Task<List<OrderItemDto>> Handle(GetOrderItemByUserIdQuery request, CancellationToken cancellationToken)
        {
            var orderItems = await context.OrderItems
                .Include(o => o.ProductDetail)
                .Where(x => x.created_by == request.user_id)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<OrderItemDto>>(orderItems);
        }
        
        
    }
}
