using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Identities.Commands.SignIn;
using Application.Identities.Commands.SignUp;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace WebApi.Controllers
{
    [ApiController]
    [Route("account")]
    public class IdentityController(IMediator mediator, ILogger<IdentityController> logger) : ControllerBase
    {

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CreateSignInCommand signInCommand)
        {
            logger.LogInformation("Login attempt for {username}: ", signInCommand.username);
            logger.LogInformation("Login attempt for {password}: ", signInCommand.password);
            return Ok(await mediator.Send(signInCommand));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateSignUpCommand signUpCommand)
        {
            logger.LogInformation("Register attempt for {username}: ", signUpCommand.username);
            logger.LogInformation("Register attempt for {password}: ", signUpCommand.password);
            return Ok(await mediator.Send(signUpCommand));
        }
    }


}