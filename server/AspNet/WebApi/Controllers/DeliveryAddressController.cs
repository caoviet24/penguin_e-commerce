using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DeliveryAddress.Commands.Create;
using Application.DeliveryAddress.Commands.Delete;
using Application.DeliveryAddress.Commands.Update;
using Application.DeliveryAddress.Queries.GetByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("delivery-address")]
    public class DeliveryAddressController(IMediator mediator) : ControllerBase
    {
        [HttpGet("get-by-user-id/{user_id}")]
        public async Task<IActionResult> GetByUserId([FromRoute] string user_id)
        {
            return Ok(await mediator.Send(new GetDeliveryAddressByUserIdQuery { user_id = user_id }));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateDeliveryAddressCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateDeliveryAddressCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            return Ok(await mediator.Send(new DeleteDeliveryAddressCommand { Id = id }));
        }
    }
}