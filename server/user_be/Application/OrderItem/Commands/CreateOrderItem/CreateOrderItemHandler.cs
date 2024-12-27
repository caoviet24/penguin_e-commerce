using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Domain.Enums;
using MediatR;
using WebApi.DBHelper;

namespace Application.OrderItem.Commands.CreateOrderItem
{

    public class CreateOrderItemCommand : IRequest<OrderItemDto>
    {
        public string seller_id { get; set; } = null!;
        public string pay_method { get; set; } = null!;
        public List<CreateOrderItemDetailCommand> list_order_item_detail = null!;
    }
    public class CreateOrderItemHandler(IDbHelper dbHelper) : IRequestHandler<CreateOrderItemCommand, OrderItemDto>
    {
        public async Task<OrderItemDto> Handle(CreateOrderItemCommand request, CancellationToken cancellationToken)
        {
            var orderData = await dbHelper.QueryProceduceByUserAsync<OrderItemDto>
            (
                "sp_create_order_item",
                new
                {
                    order_item = Guid.NewGuid().ToString(),
                    status_order = StatusOrderItem.waiting,
                    pay_method = request.pay_method,
                    total_order = 0,
                    seller_id = request.seller_id,
                }
            );

            

            foreach (var req in orderData.list_order_item_detail)
            {
                var orderDetailData = await dbHelper.QueryProceduceSingleDataAsync<OrderItemDetailDto>
                (
                    "sp_create_order_detail_item",
                    new
                    {
                        order_detail_id = Guid.NewGuid().ToString(),
                        product_detail_id = req.product_detail_id,
                        quantity = req.quantity,
                        size = req.size,
                        color = req.color,
                        order_id = orderData.Id
                    }
                );

                orderData.total_order += (req.quantity * orderDetailData.sale_price);

                orderData.list_order_item_detail.Add(orderDetailData);
            }

              await dbHelper.QueryProceduceSingleDataAsync<OrderItemDto>
            (
                "sp_update_total_order_by_Id",
                new
                {
                    order_id = orderData.Id,
                    total_order = orderData.total_order
                }
            );

            return orderData;
        }
    }
}