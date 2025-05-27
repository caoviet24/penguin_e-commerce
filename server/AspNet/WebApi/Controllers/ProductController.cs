using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Product.Commands.Active;
using Application.Product.Commands.DeleteSoft;
using Application.Product.Commands.InActive;
using Application.Product.Commands.Restore;
using Application.Product.Create;
using Application.Product.Queries.GetAll;
using Application.Product.Queries.GetById;
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
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllProducts([FromQuery] GetAllProductQuery query)
        {
            logger.LogInformation("Get all products with pagination");
            return Ok(await mediator.Send(query));
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetProductById([FromRoute] string id)
        {
            logger.LogInformation("Get product by id: {id}", id);
            return Ok(await mediator.Send(new GetProductByIdQuery { Id = id }));
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
        {
            logger.LogInformation("Create product with name: {name}", command.product_desc);
            return Ok(await mediator.Send(command));
        }

        [HttpPut("active/{Id}")]
        public async Task<IActionResult> Active([FromRoute] ActiveProductCommand command)
        {
            logger.LogInformation("Active product with id: {Id}", command.Id);
            return Ok(await mediator.Send(command));
        }

        [HttpPut("inactive/{Id}")]
        public async Task<IActionResult> InActive([FromRoute] InActiveProductCommand command)
        {
            logger.LogInformation("InActive product with id: {Id}", command.Id);
            return Ok(await mediator.Send(command));
        }

        [HttpPut("delete-soft/{Id}")]
        public async Task<IActionResult> DeleteSoft([FromRoute] DeleteSoftProductCommand command)
        {
            logger.LogInformation("Delete soft product with id: {Id}", command.Id);
            return Ok(await mediator.Send(command));
        }

        [HttpPut("restore/{Id}")]
        public async Task<IActionResult> Restore([FromRoute] RestoreProductCommand command)
        {
            logger.LogInformation("Restore product with id: {Id}", command.Id);
            return Ok(await mediator.Send(command));
        }
    }
}