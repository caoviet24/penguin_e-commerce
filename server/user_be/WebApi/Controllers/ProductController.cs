using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Product.Commands.CreateProductCommand;
using Application.Product.Queries.GetProductById;
using Application.Product.Queries.GetProductsPagination;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("product")]
    public class ProductController(ILogger<ProductController> logger, IMediator mediator) : Controller
    {
        [HttpGet("list-product")]
        public async Task<IActionResult> GetProductWithPagination([FromQuery] GetProductsPaginationQuery query)
        {
            logger.LogInformation("Get product with pagination");
            return Ok(await mediator.Send(query));
        }

        [HttpGet("get-by-id/{product_id}")]
        public async Task<IActionResult> GetProductById(GetProductByIdQuery query)
        {
            logger.LogInformation("Get product by id: {product_id}", query.product_id);
            return Ok(await mediator.Send(query));
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
        {
            logger.LogInformation("Create product with name: {name}", command.product_desc);
            return Ok(await mediator.Send(command));
        }

        

    }
}