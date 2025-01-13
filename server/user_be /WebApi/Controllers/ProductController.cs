using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Product.Commands.Active;
using Application.Product.Commands.Delete;
using Application.Product.Commands.DeleteSoft;
using Application.Product.Commands.InActive;
using Application.Product.Commands.Restore;
using Application.Product.Create;
using Application.Product.Queries.GetActive;
using Application.Product.Queries.GetActiveByBoothId;
using Application.Product.Queries.GetByDesc;
using Application.Product.Queries.GetDeleted;
using Application.Product.Queries.GetDeletedByBoothId;
using Application.Product.Queries.GetInActive;
using Application.Product.Queries.GetInActiveByBoothId;
using Application.Product.Queries.GetProductById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("product")]
    public class ProductController(ILogger<ProductController> logger, IMediator mediator) : Controller
    {
        [HttpGet("get-active")]
        public async Task<IActionResult> GetActive([FromQuery] GetProductsActiveQuery query)
        {
            logger.LogInformation("Get active products");
            return Ok(await mediator.Send(query));
        }

        [HttpGet("get-active-by-booth-id")]
        public async Task<IActionResult> GetActiveByBoothId([FromQuery] GetProductsActiveByBoothIdQuery query)
        {
            logger.LogInformation("Get active products by booth id");
            return Ok(await mediator.Send(query));
        }


        [HttpGet("get-inactive-by-booth-id")]
        public async Task<IActionResult> GetInActiveByBoothId([FromQuery] GetProductsInActiveByBoothIdQuery query)
        {
            logger.LogInformation("Get inactive products by booth id");
            return Ok(await mediator.Send(query));
        }


        [HttpGet("get-deleted-by-booth-id")]
        public async Task<IActionResult> GetDeletedByBoothId([FromQuery] GetProductsDeletedByBoothIdQuery query)
        {
            logger.LogInformation("Get deleted products by booth id");
            return Ok(await mediator.Send(query));
        }

        [HttpGet("get-by-desc")]
        public async Task<IActionResult> GetProductByDesc([FromQuery] GetProductByDescPaginationQuery query)
        {
            logger.LogInformation("Get product by desc: {product_desc}", query.product_desc);
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

        [HttpDelete("delete/{Id}")]
        public async Task<IActionResult> Delete([FromRoute] DeleteProductCommand command)
        {
            logger.LogInformation("Delete product with id: {Id}", command.Id);
            return Ok(await mediator.Send(command));
        }
    }
}