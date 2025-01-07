using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.MyBooth.Commands.CreateBooth;
using Application.MyBooth.Commands.DeleteBooth;
using Application.MyBooth.Commands.UpdateBooth;
using Application.MyBooth.Queries.GetBoothByAccId;
using Application.MyBooth.Queries.GetBoothById;
using Application.MyBooth.Queries.GetBoothByName;
using Application.MyBooth.Queries.GetBoothInactive;
using Application.MyBooth.Queries.GetListProductById;
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
        [HttpGet("get-by-acc-id/{acc_id}")]
        public async Task<IActionResult> GetBoothByAccId([FromRoute] GetBoothByAccIdPaginationQuery request)
        {
            logger.LogInformation("Get booth by account id: {account_id}", request.account_id);
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-name")]
        public async Task<IActionResult> GetBoothByName(GetBoothByNamePaginationQuery request)
        {
            logger.LogInformation("Get booth by name: {booth_name}", request.booth_name);
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-booth-inactive")]
        public async Task<IActionResult> GetBoothInactive(GetBoothInActivePaginationQuery request)
        {
            logger.LogInformation("Get booth inactive");
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-id/{booth_id}")]
        public async Task<IActionResult> GetBoothById([FromRoute] GetBoothByIdQuery request)
        {
            logger.LogInformation("Get booth by id: {booth_id}", request.booth_id);
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-products-by-id")]
        public async Task<IActionResult> GetProductsByBoothId(GetProductsByBoothIdPaginationQuery request)
        {
            logger.LogInformation("Get products by booth id: {booth_id}", request.id);
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

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteBooth(DeleteBoothCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

    }
}