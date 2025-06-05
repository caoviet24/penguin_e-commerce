using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Category.Commands.Create;
using Application.Category.Commands.Delete;
using Application.Category.Commands.Restore;
using Application.Category.Commands.Update;
using Application.Category.Queries.GetAll;
using Application.Category.Queries.GetCategoryById;
using Application.Category.Queries.GetWithPagination;
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
        public async Task<IActionResult> getAll([FromQuery] GetAllCategoryQuery request)
        {
            logger.LogInformation("Get category all");
            return Ok(await mediator.Send(request));
        }

        [HttpGet("get-with-pagination")]
        public async Task<IActionResult> getWithPagination([FromQuery] GetCategoryWithPaginationQuery request)
        {
            logger.LogInformation("Get category with pagination");
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
            logger.LogInformation("Create category with name: {name}", request.name);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateCategoryCommand request)
        {
            logger.LogInformation("Update category with name: {name}", request.name);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            logger.LogInformation("Delete category with id: {category_id}", id);
            return Ok(await mediator.Send(new DeleteCategoryCommand { Id = id }));
        }

        [HttpPut("restore/{id}")]
        public async Task<IActionResult> Restore([FromRoute] string id)
        {
            var request = new RestoreCategoryCommand { id = id };
            logger.LogInformation("Restore category with id: {category_id}", request.id);
            return Ok(await mediator.Send(request));
        }
    }
}