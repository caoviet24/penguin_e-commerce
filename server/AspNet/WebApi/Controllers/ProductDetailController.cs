using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.ProductDetail.Commands.Create;
using Application.ProductDetail.Commands.DeleteSoft;
using Application.ProductDetail.Commands.Restore;
using Application.ProductDetail.Commands.Update;
using Application.ProductDetail.Queries.GetByProductId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("product-detail")]
    public class ProductDetailController(ILogger<ProductDetailController> logger, IMediator mediator) : ControllerBase
    {
        [HttpGet("get-by-product-id/{product_id}")]
        public async Task<IActionResult> GetByProductId([FromRoute] string product_id)
        {
            logger.LogInformation("Get product detail by product id: {product_id}", product_id);
            return Ok(await mediator.Send(new GetProductDetailByProdIDQuery { product_id = product_id }));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateProductDetailCommand2 request)
        {
            logger.LogInformation("Create product detail");
            return Ok(await mediator.Send(request));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateProductDetailCommand request)
        {
            logger.LogInformation("Update product detail");
            return Ok(await mediator.Send(request));
        }

        [HttpPut("delete-soft/{id}")]
        public async Task<IActionResult> DeleteSoft([FromRoute] DeleteSoftProductDetailCommand request)
        {
            logger.LogInformation("Delete soft product detail");
            return Ok(await mediator.Send(request));
        }

        [HttpPut("restore/{id}")]
        public async Task<IActionResult> DeleteSoft([FromRoute] RestoreProductDetailCommand request)
        {
            logger.LogInformation("Delete soft product detail");
            return Ok(await mediator.Send(request));
        }
    }
}