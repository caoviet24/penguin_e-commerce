using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.OrderItem.Commands.CreateOrderItem;
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

        [HttpPost("create-to-cart")]
        public async Task<OrderItemDto> createToCart([FromBody] CreateOrderItemToCartCommand command)
        {
            logger.LogInformation("Create Order Item To Cart");
            return await mediator.Send(command);
        }

        [HttpPost("create")]
        public async Task<OrderItemDto> create([FromBody] CreateOrderItemCommand command)
        {
            return await mediator.Send(command);
        }


    }
}