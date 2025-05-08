using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.User.Commands.Update;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("user")]
    [Authorize]
    public class UserController(ISender sender) : ControllerBase
    {
        [HttpPut("update")]
        public async Task<IActionResult> update([FromBody] UpdateUserCommand command)
        {
            return Ok(await sender.Send(command));
        }
    }
}