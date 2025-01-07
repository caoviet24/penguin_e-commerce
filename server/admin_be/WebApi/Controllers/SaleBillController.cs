using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.SaleBill.Commands.CreateSaleBill;
using Application.SaleBill.Queries.GetBillStatusWaitByBuyerId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("sale-bill")]
    public class SaleBillController(ILogger<SaleBillController> logger, IMediator mediator) : ControllerBase
    {

        [HttpGet("get-status-wait-by-buyer-id")]
        public async Task<IActionResult> GetBillStatusWaitByBuyerId([FromQuery] GetBillStatusWaitByBuyerIdQuery query)
        {
            logger.LogInformation("Get bill status wait by buyer id");
            return Ok(await mediator.Send(query));
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSaleBill([FromBody] CreateSaleBillCommand command)
        {
            logger.LogInformation("Create sale bill");
            return Ok(await mediator.Send(command));
        }
    }
}