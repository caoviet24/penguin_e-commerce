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
    public class PaymentController(ILogger<PaymentController> logger,IPaymentService paymentService) : ControllerBase
    {
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentPayload payload)
        {
            if (payload.amount <= 0)
            {
                return BadRequest("Amount must be greater than 0");
            }

            var result = await paymentService.CreatePayment(payload);
            if (result == null)
            {
                return BadRequest("Failed to create payment");
            }

            return Ok(result);
        }

        [HttpGet("get-payment-link-info/{orderCode}")]
        public async Task<IActionResult> getPaymentLinkInfo([FromRoute] int orderCode)
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