using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using Dapper;
using Domain.Enums;
using MediatR;
using WebApi.DBHelper;

namespace Application.OrderItem.Commands.CreateOrderItem
{

    public class CreateOrderItemCommand : IRequest<OrderItemDto>
    {
        public string seller_id { get; set; } = null!;
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
    }
    public class CreateOrderItemHandler(IDbConnection dbConnection, IUser user) : IRequestHandler<CreateOrderItemCommand, OrderItemDto>
    {
        public async Task<OrderItemDto> Handle(CreateOrderItemCommand request, CancellationToken cancellationToken)
        {
            var orderData = await dbConnection.QueryMultipleAsync
            (
                "sp_create_order_item",
                new
                {
                    order_id = Guid.NewGuid().ToString(),
                    seller_id = request.seller_id,
                    buyer_id = user.getCurrentUser(),
                    product_detail_id = request.product_detail_id,
                    quantity = request.quantity,
                    size = request.size,
                    color = request.color,
                    created_at = DateTime.UtcNow,
                    updated_by = user.getCurrentUser(),
                    last_updated = DateTime.UtcNow,
                    is_deleted = false
                },
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, OrderItemDto> orderDic = new Dictionary<string, OrderItemDto>();

            orderData.Read<OrderItemDto, ProductDetailDto, OrderItemDto>(
                (ord, prod) =>
                {
                    if (!orderDic.TryGetValue(ord.Id, out var entry))
                    {
                        entry = ord;
                        orderDic.Add(entry.Id, entry);
                    }

                    if (prod.product_name != null)
                    {
                        entry.product_detail = prod;
                    }

                    return entry;

                },
                splitOn: "product_detail_id"
            );


            return orderDic.Values.First();
        }
    }
}