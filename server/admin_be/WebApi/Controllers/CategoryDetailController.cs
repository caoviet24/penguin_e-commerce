using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Category.Commands.Restore;
using Application.CategoryDetail.Commands.Create;
using Application.CategoryDetail.Commands.Delete;
using Application.CategoryDetail.Commands.Restore;
using Application.CategoryDetail.Queries.GetByCategoryId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("category-detail")]
    public class CategoryDetailController(ILogger<CategoryDetailController> logger, IMediator mediator) : Controller
    {

        [HttpGet("get-by-category-id/{cg_id}")]
        public async Task<IActionResult> GetByCgId([FromQuery] GetCategoryDetailByCgIdQuery request)
        {
            logger.LogInformation("Get category detail by category id: {cg_id}", request.cg_id);
            return Ok(await mediator.Send(request));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDetailCommand request)
        {
            logger.LogInformation("Create category detail with name: {name}", request.category_detail_name);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("delete-2/{id}")]
        public async Task<IActionResult> Delete2([FromRoute] DeleteCategoryDetail2Command request)
        {
            logger.LogInformation("Delete category detail with id: {id}", request.id);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("restore/{id}")]
        public async Task<IActionResult> Restore([FromRoute] RestoreCategoryDetailCommand request)
        {
            logger.LogInformation("Restore category detail with id: {id}", request.id);
            return Ok(await mediator.Send(request));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] DeleteCategoryDetailCommand request)
        {
            logger.LogInformation("Delete category detail with id: {id}", request.Id);
            return Ok(await mediator.Send(request));
        }



    }
}