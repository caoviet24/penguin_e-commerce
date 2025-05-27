using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.OrderItem.Commands.Create;
using Application.OrderItem.Commands.Delete;
using Application.OrderItem.Queries.GetByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("order-item")]
    public class OrderItemController(ILogger<OrderItemController> logger, IMediator mediator) : ControllerBase
    {

        [HttpGet("get-by-user-id/{user_id}")]
        public async Task<List<OrderItemDto>> GetOrderItemByUserId([FromRoute] string user_id)
        {
            logger.LogInformation("GetOrderItemByUserId called with user_id: {UserId}", user_id);
            return await mediator.Send(new GetOrderItemByUserIdQuery { user_id = user_id });
        }

        [HttpPost("create")]
        public async Task<OrderItemDto> Create([FromBody] CreateOrderItemCommand command)
        {
            return await mediator.Send(command);
        }

        [HttpDelete("delete/{order_id}")]
        public async Task<OrderItemDto> Delete([FromRoute] string order_id)
        {
            return await mediator.Send(new DeleteOrderItemCommand { order_id = order_id });
        }

    }
}