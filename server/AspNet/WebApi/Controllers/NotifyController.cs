using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Notification.Commands.Create;
using Application.Notification.Queries.GetByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("nofications")]
    public class NotifyController(ISender sender) : ControllerBase
    {

        [HttpGet("get-by-user-id")]
        public async Task<IActionResult> GetNotifyByUserId()
        {
            var result = await sender.Send(new GetNofityByUserIdQuery());
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateNotify([FromBody] CreateNotifyCommand command)
        {
            var result = await sender.Send(command);
            return Ok(result);
        }

    }
}