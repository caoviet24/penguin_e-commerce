using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            return Ok(await authService.authMe());
        }

        [HttpGet("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            if (!Request.Headers.TryGetValue("refresh_token", out var refreshToken))
            {
                return BadRequest(new { message = "Refresh token is missing in headers." });
            }


            var result = await authService.refreshToken(refreshToken);
            return Ok(result);


        }

    }
}