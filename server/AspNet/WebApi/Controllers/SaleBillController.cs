using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.SaleBill.Commands.Create;
using Application.SaleBill.Commands.UpdateStatus;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("sale-bill")]
    public class SaleBillController(ILogger<SaleBillController> logger, IMediator mediator) : ControllerBase
    {

    
        [HttpPost("create")]
        public async Task<IActionResult> CreateSaleBill([FromBody] CreateSaleBillCommand command)
        {
            logger.LogInformation("Create sale bill");
            return Ok(await mediator.Send(command));
        }

        [HttpPut("update-status")]
        public async Task<IActionResult> UpdateStatusBill([FromBody] UpdateStatusBillCommand command)
        {
            logger.LogInformation("Update status bill");
            return Ok(await mediator.Send(command));
        }
    }
}