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
using Application.Account.Queries.GetBanned;
using Application.Account.Queries.GetById;
using Application.Account.Queries.GetDeleted;
using Application.Account.Queries.GetListAccount;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("account")]
    public class AccountController(ILogger<AccountController> _logger, IMediator mediator) : ControllerBase
    {
        [HttpGet("get-with-pagination")]
        public async Task<IActionResult> GetAll(GetListAccountPaginationQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-deleted")]
        public async Task<IActionResult> GetDeleted(GetAccountDeletedQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-banned")]
        public async Task<IActionResult> GetBanned(GetAccountBannedQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }
        

        [HttpGet("get-by-id/{acc_id}")]
        public async Task<IActionResult> GetById([FromRoute] GetAccountByIdQuery request)
        {
            var data = await mediator.Send(request);
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