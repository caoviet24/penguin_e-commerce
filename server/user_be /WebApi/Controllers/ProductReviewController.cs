using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.ProductReview.Commands.Create;
using Application.ProductReview.Queries.GetByProduct;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("product-review")]
    public class ProductReviewController(IMediator mediator) : ControllerBase
    {
        [HttpGet("get-by-product-id/{product_id}")]
        public async Task<IActionResult> GetByProductId([FromRoute] GetReviewsByProductIdQuery query)
        {
            var data = await mediator.Send(query);
            return Ok(data);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProductReview([FromBody] CreateProductReviewCommand command)
        {
            var data = await mediator.Send(command);
            return Ok(data);
        }
    }
}