using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("payment")]
    public class PaymentController(IPaymentService paymentService) : ControllerBase
    {
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentPayload payload)
        {
            var result = await paymentService.CreatePayment(payload);
            return Ok(result);
        }

        [HttpGet("get-info")]
        public async Task<IActionResult> getPaymentLinkInfo([FromQuery] int orderCode)
        {
            var result = await paymentService.GetPaymentLinkInformation(orderCode);
            if (result == null)
            {
                return NotFound("Payment link not found");
            }

            return Ok(result);
        }

        [HttpGet("cancel/{orderCode}")]
        public async Task<IActionResult> CancelPayment([FromRoute] int orderCode, [FromQuery] string? reason = null)
        {
            var result = await paymentService.CancelPayment(orderCode, reason);
            if (result == null)
            {
                return NotFound("Payment link not found");
            }

            return Ok(result);
        }

    }
}