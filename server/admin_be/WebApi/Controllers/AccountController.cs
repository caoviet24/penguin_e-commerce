using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Account.Queries.GetById;
using Application.Account.Queries.GetListAccount;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("account")]
    public class AccountController(ILogger<AccountController> _logger, IMediator mediator) : Controller
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllAccount(GetListAccountPaginationQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetAccountById(GetAccountByIdQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }
    }
}