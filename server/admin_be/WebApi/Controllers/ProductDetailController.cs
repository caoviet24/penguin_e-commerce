using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.ProductDetail.Queries.GetProductDetailByCgId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{

    [Route("product-detail")]
    public class ProductDetailController(ILogger<ProductDetailController> logger, IMediator mediator) : ControllerBase
    {
        [HttpGet("get-by-cg-detail-id")]
        public async Task<IActionResult> GetProductDetailByCgDetailId([FromQuery] GetProductDetailByCgDetailIdQuery request)
        {
            logger.LogInformation("Get product detail by category detail id: {category_id}", request.cg_detail_id);
            return Ok(await mediator.Send(request));
        }
    }
}