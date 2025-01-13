using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Statistical.Seller;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("statistical")]
    public class StatisticalController(IMediator mediator) : ControllerBase
    {
        [HttpGet("total-by-seller/{seller_id}")]
        public async Task<IActionResult> GetTotalBySeller([FromRoute] StatisticalTotalBySellerQuery query)
        {
            var data = await mediator.Send(query);
            return Ok(data);
        }

        [HttpGet("get-total-product-by-seller/{seller_id}")]
        public async Task<IActionResult> GetTotalProductBySeller([FromRoute] GetTotalProductBySellerQuery query)
        {
            var data = await mediator.Send(query);
            return Ok(data);
        }

        [HttpGet("by-seller")]
        public async Task<IActionResult> GetBySeller([FromQuery] StatisticalBySellerQuery query)
        {
            var data = await mediator.Send(query);
            return Ok(data);
        }
    }
}