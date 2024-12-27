using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using MediatR;

namespace Application.Category.Commands.UpdateCategory
{
    public class UpdateCategoryCommand : IRequest<CategoryDto>
    {
        public string category_id { get; set; }
        public string category_name { get; set; }
        public string category_desc { get; set; }
        public string category_image { get; set; }

    }
}