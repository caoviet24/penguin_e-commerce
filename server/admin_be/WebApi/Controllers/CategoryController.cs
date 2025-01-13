using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Category.Commands.Create;
using Application.Category.Commands.Delete;
using Application.Category.Commands.Restore;
using Application.Category.Commands.Update;
using Application.Category.Queries.GetByNamePagination;
using Application.Category.Queries.GetCategoriesWithPagination;
using Application.Category.Queries.GetCategoryById;
using Application.Category.Queries.GetDeleted;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("category")]
    public class CategoryController(ILogger<CategoryController> logger, IMediator mediator) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> getWithPagination([FromQuery] GetCategoryPaginationQuery request ) 
        {
            logger.LogInformation("Get category with pagination");
            return Ok(await mediator.Send(request));
        }

        [HttpGet("get-deleted")]
        public async Task<IActionResult> getDeleted([FromQuery] GetCategoryDeletedQuery request)
        {
            logger.LogInformation("Get deleted category with pagination");
            return Ok(await mediator.Send(request));
        }

        [HttpGet("get-by-name")]
        public async Task<IActionResult> getByName([FromQuery] GetCategoryPaginationByNameQuery request)
        {
            logger.LogInformation("Get category by name: {category_name}", request.category_name);
            return Ok(await mediator.Send(request));
        }

       [HttpGet("get-by-id/{category_id}")]
        public async Task<IActionResult> getById([FromRoute] GetCategoryByIdQuery request)
        {
            logger.LogInformation("Get category by id : {category_id}", request.category_id);
            return Ok(await mediator.Send(request));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryCommand request)
        {
            logger.LogInformation("Create category with name: {name}", request.category_name);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateCategoryCommand request)
        {
            logger.LogInformation("Update category with name: {name}", request.category_name);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] DeleteCategoryCommand request)
        {
            logger.LogInformation("Delete category with id: {category_id}", request.Id);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("restore/{id}")]
        public async Task<IActionResult> Restore([FromRoute] RestoreCategoryCommand request)
        {
            logger.LogInformation("Restore category with id: {category_id}", request.id);
            return Ok(await mediator.Send(request));
        }
    }
}