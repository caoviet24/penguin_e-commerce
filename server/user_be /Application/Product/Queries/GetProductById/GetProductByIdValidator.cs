using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Product.Queries.GetProductById
{
    public class GetProductByIdValidator : AbstractValidator<GetProductByIdQuery>
    {
        public GetProductByIdValidator()
        {
            RuleFor(x => x.product_id).NotEmpty().WithMessage("Mã sản phẩm là bắt buộc");
        }
        
    }
}