using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Category.Commands.UpdateCategory
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryCommand>
    {
        public UpdateCategoryValidator()
        {
            RuleFor(x => x.category_id)
                .NotEmpty().WithMessage("Category ID is required");
            RuleFor(x => x.category_name)
            .NotEmpty().WithMessage("Category name is required");
            RuleFor(x => x.category_desc)
            .NotEmpty().WithMessage("Category description is required");
            RuleFor(x => x.category_image)
            .NotEmpty().WithMessage("Category image is required");
        }
    }
}