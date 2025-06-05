using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Statistical.Admin;
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

        [HttpGet("overview-admin")]
        public async Task<IActionResult> GetOverViewAdmin([FromQuery] GetOverViewAdmin query)
        {
            return Ok(await mediator.Send(query));
        }

        [HttpGet("overview-seller/{seller_id}")]
        public async Task<IActionResult> GetOverViewSeller([FromRoute] GetOverViewSeller query)
        {
            var data = await mediator.Send(query);
            return Ok(data);
        }

        [HttpGet("statistics-by-seller")]
        public async Task<IActionResult> GetStatisticalBySeller([FromQuery] GetStatisticalBySellerQuery query)
        {
            var data = await mediator.Send(query);
            return Ok(data);
        }
    }
}