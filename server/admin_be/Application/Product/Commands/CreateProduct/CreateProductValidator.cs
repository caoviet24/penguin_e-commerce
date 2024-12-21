using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Product.Commands.CreateProductCommand
{
    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.product_desc).NotEmpty().WithMessage("Mô tả sản phẩm là bắt buộc");
            RuleFor(x => x.category_detail_id).NotEmpty().WithMessage("Danh mục là bắt buộc");
        }
    };

    public class CreateProductDetailValidator : AbstractValidator<CreateProductDetailCommand>
    {
        public CreateProductDetailValidator()
        {
            RuleFor(x => x.product_name).NotEmpty().WithMessage("Tên sản phẩm là bắt buộc");
            RuleFor(x => x.color).NotEmpty().WithMessage("Màu sắc là bắt buộc");
            RuleFor(x => x.price_sale).GreaterThan(0).WithMessage("Giá bán phải lớn hơn 0");
            RuleFor(x => x.promotional_price).GreaterThan(0).WithMessage("Giá khuyến mãi là bắt buộc");
        }
    }
}
