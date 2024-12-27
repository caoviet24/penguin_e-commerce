using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Category.Commands.CreateCategory
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryCommand>
    {
        // public CreateCategoryValidator()
        // {
        //     RuleFor(x => x.category_name)
        //         .NotEmpty().WithMessage("Category name is required");
        // }
    }
}