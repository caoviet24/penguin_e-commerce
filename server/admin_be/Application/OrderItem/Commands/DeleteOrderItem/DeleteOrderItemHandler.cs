using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.OrderItem.Commands.DeleteOrderItem
{
    public class DeleteOrderItemCommand : IRequest<OrderItemDto>
    {
        public string order_id { get; set; } = null!;
    }
    public class DeleteOrderItemHandler(IDbHelper dbHelper) : IRequestHandler<DeleteOrderItemCommand, OrderItemDto>
    {
        public async Task<OrderItemDto> Handle(DeleteOrderItemCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<OrderItemDto>
            (
                "sp_detele_order_item_by_id",
                new
                {
                    order_id = request.order_id,
                }
            );

            return data;
        }
    }
}