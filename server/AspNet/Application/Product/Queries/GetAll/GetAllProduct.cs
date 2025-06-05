using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Product.Queries.GetAll
{
    public class GetAllProductQuery : IRequest<ResponDataDto<List<ProductDto>>>
    {
        public int page_number { get; set; } = 1;
        public int page_size { get; set; } = 10;
        public string? search { get; set; }
        public string? booth_id { get; set; }
        public string? category_detail_id { get; set; }
        public string? status { get; set; }
        public bool? is_active { get; set; }
        public bool? is_deleted { get; set; } 
        public double? min_price { get; set; }
        public double? max_price { get; set; }
    }

    public class GetAllProductQueryValidator : AbstractValidator<GetAllProductQuery>
    {
        public GetAllProductQueryValidator()
        {
            RuleFor(x => x.page_number)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0.");
            RuleFor(x => x.page_size)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0.");
        }
    }

    public class GetAllProductQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAllProductQuery, ResponDataDto<List<ProductDto>>>
    {

        public async Task<ResponDataDto<List<ProductDto>>> Handle(GetAllProductQuery request, CancellationToken cancellationToken)
        {
            var query = context.Products.Include(p => p.ListProductDetail).AsQueryable();

            if (!string.IsNullOrEmpty(request.search))
            {
                query = query.Where(x => x.product_desc.Contains(request.search));
            }
            if (!string.IsNullOrEmpty(request.booth_id))
            {
                query = query.Where(x => x.created_by == request.booth_id);
            }
            if (!string.IsNullOrEmpty(request.category_detail_id))
            {
                query = query.Where(x => x.category_detail_id == request.category_detail_id);
            }
            if (!string.IsNullOrEmpty(request.status))
            {
                query = query.Where(x => x.status == request.status);
            }
            if (request.is_active.HasValue)
            {
                query = query.Where(x => x.is_active == request.is_active.Value);
            }

            if (request.is_deleted.HasValue)
            {
                query = query.Where(x => x.is_deleted == request.is_deleted.Value);
            }


            if (request.min_price.HasValue)
            {
                query = query.Where(x => x.ListProductDetail.Any(pd => pd.sale_price >= request.min_price));
            }
            if (request.max_price.HasValue)
            {
                query = query.Where(x => x.ListProductDetail.Any(pd => pd.sale_price <= request.max_price));
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var products = await query
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            var productDtos = mapper.Map<List<ProductDto>>(products);

            foreach (var product in productDtos)
            {
                product.list_product_detail = mapper.Map<List<ProductDetailDto>>(
                    products.FirstOrDefault(p => p.Id == product.Id)?.ListProductDetail);
            }

            return new ResponDataDto<List<ProductDto>>
            {
                data = productDtos,
                total_record = totalRecords,
                page_number = request.page_number,
                page_size = request.page_size
            };
        }
    }
}