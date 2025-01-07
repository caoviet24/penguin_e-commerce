using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;
using WebApi.DBHelper;

namespace Application.OrderItem.Queries.GetOrderItemByBuyer
{
    public class GetOrderItemByBuyerIdQuery : IRequest<List<OrderItemDto>>
    {
        public string buyer_id { get; set; } = null!;
    }
    public class GetOrderByBuyerIdHandler(IDbConnection dbConnection) : IRequestHandler<GetOrderItemByBuyerIdQuery, List<OrderItemDto>>
    {
        public async Task<List<OrderItemDto>> Handle(GetOrderItemByBuyerIdQuery request, CancellationToken cancellationToken)
        {
            var orderData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_order_item_by_buyer_id",
                new
                {
                    buyer_id = request.buyer_id,
                }
            );

            Dictionary<string, OrderItemDto> orderDic = new Dictionary<string, OrderItemDto>();
            orderData.Read<OrderItemDto, ProductDetailDto, OrderItemDto>
            (
                (order, prod) =>
                {
                    if (!orderDic.TryGetValue(order.Id, out var orderEntry))
                    {
                        orderEntry = order;
                        orderDic.Add(orderEntry.Id, orderEntry);
                    }

                    if (prod.product_name != null)
                    {
                        orderEntry.product_detail = prod;
                    }

                    return orderEntry;
                },
                splitOn: "product_detail_id"
            );

            return orderDic.Values.ToList();
            
        }
    }
}