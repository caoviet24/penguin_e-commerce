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


    }
}