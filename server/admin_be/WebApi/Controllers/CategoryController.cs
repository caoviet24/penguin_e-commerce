using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Category.Commands.CreateCategory;
using Application.Category.Queries.GetByNamePagination;
using Application.Category.Queries.GetCategoriesWithPagination;
using Application.Category.Queries.GetCategoryById;
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
        public async Task<IActionResult> getCategoryWithPagination([FromQuery] GetCategoryPaginationQuery request ) 
        {
            logger.LogInformation("Get category with pagination");
            return Ok(await mediator.Send(request));
        }

        [HttpGet("get-by-name")]
        public async Task<IActionResult> getCategoryByName([FromQuery] GetCategoryPaginationByNameQuery request)
        {
            logger.LogInformation("Get category by name: {category_name}", request.category_name);
            return Ok(await mediator.Send(request));
        }

       [HttpGet("get-by-id/{category_id}")]
        public async Task<IActionResult> getCategoryById([FromRoute] GetCategoryByIdQuery request)
        {
            logger.LogInformation("Get category by id : {category_id}", request.category_id);
            return Ok(await mediator.Send(request));
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryCommand createCategoryCommand)
        {
            logger.LogInformation("Create category with name: {name}", createCategoryCommand.category_name);
            return Ok(await mediator.Send(createCategoryCommand));
        }
    }
}