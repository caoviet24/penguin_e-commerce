using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Account.Commands.Ban;
using Application.Account.Commands.Delete;
using Application.Account.Commands.Restore;
using Application.Account.Commands.Update;
using Application.Account.Queries.GetAccountsDeleted;
using Application.Account.Queries.GetById;
using Application.Account.Queries.GetListAccount;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("account")]
    public class AccountController(ILogger<AccountController> _logger, IMediator mediator) : Controller
    {
    
        [HttpGet("get-by-id/{acc_id}")]
        public async Task<IActionResult> GetById([FromRoute] GetAccountByIdQuery request)
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
    }
}