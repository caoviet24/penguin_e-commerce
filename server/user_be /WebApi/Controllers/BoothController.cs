using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.MyBooth.Commands.Active;
using Application.MyBooth.Commands.Ban;
using Application.MyBooth.Commands.CreateBooth;
using Application.MyBooth.Commands.DeleteBooth;
using Application.MyBooth.Commands.Restore;
using Application.MyBooth.Commands.UnBan;
using Application.MyBooth.Commands.UpdateBooth;
using Application.MyBooth.Queries.GetActive;
using Application.MyBooth.Queries.GetActiving;
using Application.MyBooth.Queries.GetBanned;
using Application.MyBooth.Queries.GetBoothById;
using Application.MyBooth.Queries.GetBoothByName;
using Application.MyBooth.Queries.GetBoothInactive;
using Application.MyBooth.Queries.GetByAccId;
using Application.MyBooth.Queries.GetDeleted;
using Application.MyBooth.Queries.GetListProductById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("booth")]
    public class BoothController(ILogger<BoothController> logger, IMediator mediator) : Controller
    {
        [HttpGet("get-by-acc-id/{acc_id}")]
        public async Task<IActionResult> GetByAccId([FromRoute] GetBoothByAccIdQuery request)
        {
            logger.LogInformation("Get booth by account id: {account_id}", request.acc_id);
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-name")]
        public async Task<IActionResult> GetByName(GetBoothByNamePaginationQuery request)
        {
            logger.LogInformation("Get booth by name: {booth_name}", request.booth_name);
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-activing")]
        public async Task<IActionResult> GetActiving(GetBoothActivingQuery request)
        {
            logger.LogInformation("Get booth activing");
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-active")]
        public async Task<IActionResult> GetBoothActive(GetBoothActiveQuery request)
        {
            logger.LogInformation("Get booth active");
            var data = await mediator.Send(request);
            return Ok(data);
        }


        [HttpGet("get-by-id/{booth_id}")]
        public async Task<IActionResult> GetById([FromRoute] GetBoothByIdQuery request)
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
        public async Task<IActionResult> Create([FromBody] CreateBoothCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateBoothCommand request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }


    }
}