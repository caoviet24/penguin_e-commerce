using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.OrderItem.Commands.Delete
{
    public class DeleteOrderItemCommand : IRequest<OrderItemDto>
    {
        public string order_id { get; set; } = null!;
    }
    public class DeleteOrderItemCommandValidator : AbstractValidator<DeleteOrderItemCommand>
    {
        public DeleteOrderItemCommandValidator()
        {
            RuleFor(x => x.order_id).NotEmpty().WithMessage("Order ID is required.");
        }
    }

    public class DeleteOrderItemCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteOrderItemCommand, OrderItemDto>
    {
        public async Task<OrderItemDto> Handle(DeleteOrderItemCommand request, CancellationToken cancellationToken)
        {
            var orderItem = await context.OrderItems.FirstOrDefaultAsync(o => o.Id == request.order_id, cancellationToken);
            if (orderItem == null)
            {
                throw new NotFoundException("Order item not found.");
            }

            context.OrderItems.Remove(orderItem);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<OrderItemDto>(orderItem);
        }
    }
}