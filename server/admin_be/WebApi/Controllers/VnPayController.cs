using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("vnpay")]
    public class VnPayController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IConfiguration _configuration;

        public VnPayController(IVnPayService vnPayService, IConfiguration configuration)
        {
            _vnPayService = vnPayService;
            _configuration = configuration;
        }

        [HttpPost("create")]
        public IActionResult CreatePayment([FromBody] PaymentInformationModel model)
        {
            if (model.Amount <= 0)
            {
                return BadRequest("Amount must be greater than 0");
            }

            var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, model);

            return Ok(new { paymentUrl });
        }

        [HttpGet("callback")]
        public IActionResult PaymentCallback()
        {
            try
            {
                // Log the incoming callback parameters
                var callbackParams = Request.Query.ToDictionary(x => x.Key, x => x.Value.ToString());
                Console.WriteLine($"VNPay Callback received: {System.Text.Json.JsonSerializer.Serialize(callbackParams)}");
                
                // Process the payment response
                var response = _vnPayService.ProcessPaymentResponse(Request.Query);
                
                // Check if the payment was successful
                if (response.Success)
                {
                    Console.WriteLine($"Payment successful: OrderId={response.OrderId}, TransactionId={response.TransactionId}");
                    
                    // TODO: Update order status in database
                    // TODO: Create payment record
                    
                    // For debugging purposes in development
                    if (_configuration["Environment"] == "Development")
                    {
                        Console.WriteLine($"Payment details: {System.Text.Json.JsonSerializer.Serialize(response)}");
                    }
                }
                else
                {
                    Console.WriteLine($"Payment failed: OrderId={response.OrderId}, ResponseCode={response.VnPayResponseCode}");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing payment callback: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred processing the payment callback" });
            }
        }
    }
}