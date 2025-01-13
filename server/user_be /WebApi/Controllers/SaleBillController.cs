using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.SaleBill.Commands.CreateSaleBill;
using Application.SaleBill.Commands.UpdateStatus;
using Application.SaleBill.Queries.Buyer.GetByStatus;
using Application.SaleBill.Queries.Seller.GetByStatus;
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

        [HttpGet("get-by-buyer-id-and-status")]
        public async Task<IActionResult> GetByBuyer([FromQuery] GetBillByStatusAndBuyerIdQuery query)
        {
            logger.LogInformation("Get bill by status wait");
            return Ok(await mediator.Send(query));
        }

        [HttpGet("get-by-seller-id-and-status")]
        public async Task<IActionResult> GetBySeller([FromQuery] GetBillByStatusAndSellerIdQuery query)
        {
            logger.LogInformation("Get bill by status wait");
            return Ok(await mediator.Send(query));
        }
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