using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.BackBill.Command.Create;
using Application.BackBill.Command.Update;
using Application.BackBill.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("back-bill")]
    public class BackBillController(IMediator mediator) : ControllerBase
    {

        [HttpGet("get-by-bill-id/{id}")]
        public async Task<IActionResult> GetBackBillByBillId([FromRoute] string id)
        {
            return Ok(await mediator.Send(new GetByBillIdQuery { Id = id }));
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBackBill([FromBody] CreateBackBillCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateBackBill([FromBody] UpdateBackBillCommand command)
        {
            return Ok(await mediator.Send(command));
        }
    }
}