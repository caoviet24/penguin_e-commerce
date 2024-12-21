using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.CategoryDetail.Commands.CreateCategoryDetail;
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

        [HttpPost("create")]
        public async Task<IActionResult> CreateCategoryDetail([FromBody] CreateCategoryDetailCommand createCategoryDetailCommand)
        {
            logger.LogInformation("Create category detail with name: {name}", createCategoryDetailCommand.category_detail_name);
            return Ok(await mediator.Send(createCategoryDetailCommand));
        }
        
    }
}