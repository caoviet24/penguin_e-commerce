using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using MediatR;

namespace Application.Category.Commands.DeleteCategory
{
    public class DeleteCategoryCommand : IRequest<CategoryDto>
    {
        public string category_id { get; set; } = null!;
    }
}