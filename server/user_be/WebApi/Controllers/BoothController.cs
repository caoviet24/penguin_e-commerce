using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.MyBooth.Commands.CreateBooth;
using Application.MyBooth.Commands.UpdateBooth;
using Application.MyBooth.Queries.GetBoothByAccId;
using Application.MyBooth.Queries.GetBoothById;
using Application.MyBooth.Queries.GetBoothByName;
using Application.MyBooth.Queries.GetBoothInactive;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("booth")]
    public class BoothController(ILogger<BoothController> logger, IMediator mediator) : Controller
    {
        [HttpGet("get-by-acc-id")]
        public async Task<IActionResult> GetBoothByAccId(GetBoothByAccIdPaginationQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-name")]
        public async Task<IActionResult> GetBoothByName(GetBoothByNamePaginationQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-booth-inactive")]
        public async Task<IActionResult> GetBoothInactive(GetBoothInActivePaginationQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetBoothById(GetBoothByIdQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBooth([FromBody] CreateBoothCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("ban")]
        public async Task<IActionResult> BanBooth(BanBoothCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("active")]
        public async Task<IActionResult> ActiveBooth(ActiveBoothCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

    }
}