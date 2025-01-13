using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Category.Queries.GetCategoriesWithPagination
{
    public class GetCategoryPaginationValidator : AbstractValidator<GetCategoryPaginationQuery>
    {
        public GetCategoryPaginationValidator()
        {
            RuleFor(x => x.page_number)
                .NotEmpty().WithMessage("Page is required");

            RuleFor(x => x.page_size)
                .NotEmpty().WithMessage("Page Size is required");
        }
    }
}