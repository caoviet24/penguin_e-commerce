using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Dtos;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.OrderItem.Commands.Create
{
    public class CreateOrderItemCommand : IRequest<OrderItemDto>
    {
        public string booth_id { get; set; } = null!;
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
    }

    public class CreateOrderItemCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateOrderItemCommand, OrderItemDto>
    {
        public async Task<OrderItemDto> Handle(CreateOrderItemCommand request, CancellationToken cancellationToken)
        {
            var checkOrderExit = await context.OrderItems.FirstOrDefaultAsync(o => o.booth_id == request.booth_id && o.product_detail_id == request.product_detail_id, cancellationToken);
            if (checkOrderExit != null)
            {
                checkOrderExit.quantity += request.quantity;
                context.OrderItems.Update(checkOrderExit);
                await context.SaveChangesAsync(cancellationToken);
                return mapper.Map<OrderItemDto>(checkOrderExit);
            }
            else
            {
                var newOrderItem = mapper.Map<OrderItemEntity>(request);
                
                if (string.IsNullOrEmpty(newOrderItem.Id))
                {
                    newOrderItem.Id = Guid.NewGuid().ToString();
                }
                
                await context.OrderItems.AddAsync(newOrderItem, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
                return mapper.Map<OrderItemDto>(newOrderItem);
            }

        }
    }

}