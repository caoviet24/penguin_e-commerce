using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Category.Commands.Restore;
using Application.CategoryDetail.Commands.Create;
using Application.CategoryDetail.Commands.Delete;
using Application.CategoryDetail.Commands.Update;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("category-detail")]
    public class CategoryDetailController(ILogger<CategoryDetailController> logger, IMediator mediator) : Controller
    {
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDetailCommand request)
        {
            logger.LogInformation("Create category detail with name: {name}", request.name);
            return Ok(await mediator.Send(request));
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] UpdateCategoryDetailCommand request)
        {
            logger.LogInformation("Update category detail with id: {id}", request.Id);
            return Ok(await mediator.Send(request));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            logger.LogInformation("Delete category detail with id: {id}", id);
            return Ok(await mediator.Send(new DeleteCategoryDetailCommand { Id = id }));
        }
    }
}