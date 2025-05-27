using FluentValidation;

namespace Application.Category.Commands.Create
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryCommand>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(200).WithMessage("Category name must not exceed 200 characters.");

            RuleFor(x => x.image)
                .NotEmpty().WithMessage("Image is required.");

            // RuleFor(x => x.list_category_detail)
            //     .NotNull().WithMessage("Category details list cannot be null.")
            //     .Must(x => x != null && x.Count > 0).WithMessage("At least one category detail is required.");

            // RuleForEach(x => x.list_category_detail)
            //     .SetValidator(new CreateCategoryDetail2Validator());
        }
    }

    public class CreateCategoryDetail2Validator : AbstractValidator<CreateCategoryDetail2Command>
    {
        public CreateCategoryDetail2Validator()
        {
            RuleFor(x => x.name)
                .NotEmpty().WithMessage("Category detail name is required.")
                .MaximumLength(200).WithMessage("Category detail name must not exceed 200 characters.");
        }
    }
}