using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.FakeData;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("seed")]
    public class SeedController(IMediator mediator) : ControllerBase
    {
        [HttpPost("fake-account")]
        public async Task<IActionResult> CreateFakeAccount([FromBody] FakeAccountCommand request)
        {
            return Ok(await mediator.Send(request));
        }

        [HttpPost("fake-booth")]
        public async Task<IActionResult> CreateFakeBooth([FromBody] FakeBoothCommand request)
        {
            return Ok(await mediator.Send(request));
        }

        [HttpPost("fake-category")]
        public async Task<IActionResult> CreateFakeCategory([FromBody] FakeCategoryCommand request)
        {
            return Ok(await mediator.Send(request));
        }


        [HttpPost("fake-product")]
        public async Task<IActionResult> CreateFakeProduct([FromBody] FakeProductCommand request)
        {
            return Ok(await mediator.Send(request));
        }

        [HttpPost("fake-product-review")]
        public async Task<IActionResult> CreateFakeProductReview([FromBody] FakeProductReviewCommand request)
        {
            return Ok(await mediator.Send(request));
        }


    }
}