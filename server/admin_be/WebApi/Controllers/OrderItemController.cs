using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.OrderItem.Commands.CreateOrderItem;
using Application.OrderItem.Commands.DeleteOrderItem;
using Application.OrderItem.Queries.GetOrderItemByBuyer;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("order-item")]
    public class OrderItemController(ILogger<OrderItemController> logger, IMediator mediator) : ControllerBase
    {

        [HttpGet("get-by-buyer-id")]
        public async Task<List<OrderItemDto>> GetOrderItemByBuyerId([FromQuery] GetOrderItemByBuyerIdQuery query)
        {
            return await mediator.Send(query);
        }

        [HttpPost("create")]
        public async Task<OrderItemDto> create([FromBody] CreateOrderItemCommand command)
        {
            return await mediator.Send(command);
        }

        [HttpDelete("delete/{order_id}")]
        public async Task<OrderItemDto> delete([FromRoute] DeleteOrderItemCommand command)
        {
            return await mediator.Send(command);
        }


    }
}