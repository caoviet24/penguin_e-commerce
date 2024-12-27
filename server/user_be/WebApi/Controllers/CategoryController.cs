using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Category.Commands.CreateCategory;
using Application.Category.Queries.GetCategoriesWithPagination;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("category")]
    public class CategoryController(ILogger<CategoryController> logger, IMediator mediator) : ControllerBase
    {
        [HttpGet("list-category")]
        public async Task<IActionResult> getCategoryWithPagination([FromQuery] GetCategoryPaginationQuery getCategoryPaginationQuery ) 
        {
            logger.LogInformation("Get category with pagination");
            return Ok(await mediator.Send(getCategoryPaginationQuery));
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryCommand createCategoryCommand)
        {
            logger.LogInformation("Create category with name: {name}", createCategoryCommand.category_name);
            return Ok(await mediator.Send(createCategoryCommand));
        }
    }
}