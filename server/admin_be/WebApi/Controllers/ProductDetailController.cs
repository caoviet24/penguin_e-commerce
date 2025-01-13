using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.ProductDetail.Commands.Create;
using Application.ProductDetail.Commands.DeleteSoft;
using Application.ProductDetail.Commands.Restore;
using Application.ProductDetail.Commands.Update;
using Application.ProductDetail.Commands.UpdateQuantity;
using Application.ProductDetail.Queries.GetProductDetailByCgId;
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
        [HttpGet("get-by-cg-detail-id")]
        public async Task<IActionResult> GetProductDetailByCgDetailId([FromQuery] GetProductDetailByCgDetailIdQuery request)
        {
            logger.LogInformation("Get product detail by category detail id: {category_id}", request.cg_detail_id);
            return Ok(await mediator.Send(request));
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

        [HttpPut("update-quantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQuantityProductDetailCommand request)
        {
            logger.LogInformation("Update quantity product detail");
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