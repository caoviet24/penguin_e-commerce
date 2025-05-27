using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Account.Commands.Ban;
using Application.Account.Commands.Delete;
using Application.Account.Commands.Restore;
using Application.Account.Commands.UnBan;
using Application.Account.Commands.Update;
using Application.Account.Queries.GetAll;
using Application.Account.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("account")]
    public class AccountController(IMediator mediator) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll([FromQuery] GetAllAccountQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }
        

        [HttpGet("get-by-id/{acc_id}")]
        public async Task<IActionResult> GetById([FromRoute] string acc_id)
        {
            var data = await mediator.Send(new GetAccountByIdQuery { acc_id = acc_id });
            return Ok(data);
        }

        [HttpPut("delete/{acc_id}")]
        public async Task<IActionResult> Delete([FromRoute] DeleteAccountCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateAccountCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("restore/{acc_id}")]
        public async Task<IActionResult> Restore([FromRoute] RestoreAccountCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("ban/{acc_id}")]
        public async Task<IActionResult> Ban([FromRoute] BanAccountCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("unban/{acc_id}")]
        public async Task<IActionResult> UnBan([FromRoute] UnBanAccountCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }
    }
}