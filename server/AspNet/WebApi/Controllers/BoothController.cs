using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Booth.Commands.Close;
using Application.Booth.Commands.Open;
using Application.Booth.Queries.GetByUserId;
using Application.MyBooth.Commands.Active;
using Application.MyBooth.Commands.Ban;
using Application.MyBooth.Commands.CreateBooth;
using Application.MyBooth.Commands.DeleteBooth;
using Application.MyBooth.Commands.Restore;
using Application.MyBooth.Commands.UnBan;
using Application.MyBooth.Commands.UpdateBooth;
using Application.MyBooth.Queries.GetAll;
using Application.MyBooth.Queries.GetBoothById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("booth")]
    public class BoothController(ILogger<BoothController> logger, IMediator mediator) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll([FromQuery] GetAllBoothQuery request)
        {
            var data = await mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("get-by-id/{booth_id}")]
        public async Task<IActionResult> GetById([FromRoute] string booth_id)
        {
            logger.LogInformation("Get booth by id: {booth_id}", booth_id);
            var data = await mediator.Send(new GetBoothByIdQuery { booth_id = booth_id });
            return Ok(data);
        }

        [HttpGet("get-by-user-id/{user_id}")]
        public async Task<IActionResult> GetByUserId([FromRoute] string user_id)
        {
            logger.LogInformation("Get booth by user id: {user_id}", user_id);
            var data = await mediator.Send(new GetBoothByUserIdQuery { user_id = user_id });
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

        [HttpPut("close/{booth_id}")]
        public async Task<IActionResult> CloseBooth([FromRoute] string booth_id)
        {
            logger.LogInformation("Close booth with id: {booth_id}", booth_id);
            var data = await mediator.Send(new CloseBoothCommand { booth_id = booth_id });
            return Ok(data);
        }

        [HttpPut("open/{booth_id}")]
        public async Task<IActionResult> OpenBooth([FromRoute] string booth_id)
        {
            logger.LogInformation("Open booth with id: {booth_id}", booth_id);
            var data = await mediator.Send(new OpenBoothCommand { booth_id = booth_id });
            return Ok(data);
        }


        [HttpPut("ban/{booth_id}")]
        public async Task<IActionResult> Ban([FromRoute] string booth_id)
        {
            logger.LogInformation("Ban booth with id: {booth_id}", booth_id);
            var data = await mediator.Send(new BanBoothCommand { booth_id = booth_id });
            return Ok(data);
        }

        [HttpPut("unban/{booth_id}")]
        public async Task<IActionResult> UnBan([FromRoute] string booth_id)
        {
            logger.LogInformation("Unban booth with id: {booth_id}", booth_id);
            var data = await mediator.Send(new UnBanBoothCommand { booth_id = booth_id });
            return Ok(data);
        }

        [HttpPut("active/{booth_id}")]
        public async Task<IActionResult> Active([FromRoute] string booth_id)
        {
            logger.LogInformation("Activate booth with id: {booth_id}", booth_id);
            var data = await mediator.Send(new ActiveBoothCommand { booth_id = booth_id });
            return Ok(data);
        }

        [HttpPut("delete/{booth_id}")]
        public async Task<IActionResult> Delete([FromRoute] string booth_id)
        {
            var data = await mediator.Send(new DeleteBoothCommand { booth_id = booth_id });
            return Ok(data);
        }

        [HttpPut("restore/{booth_id}")]
        public async Task<IActionResult> Restore([FromRoute] string booth_id)
        {
            var data = await mediator.Send(new RestoreBoothCommand { booth_id = booth_id });
            return Ok(data);
        }


    }
}