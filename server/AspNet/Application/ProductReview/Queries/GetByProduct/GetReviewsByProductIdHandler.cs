using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Application.Common.Interfaces;
using Dapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.ProductReview.Queries.GetByProduct
{
    public class GetReviewsByProductIdQuery : IRequest<ResponDataDto<List<ProductReviewDto>>>
    {
        public string product_id { get; set; } = null!;
        public int page_size { get; set; }
        public int page_number { get; set; }
    }
    public class GetReviewsByProductIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetReviewsByProductIdQuery, ResponDataDto<List<ProductReviewDto>>>
    {
        public async Task<ResponDataDto<List<ProductReviewDto>>> Handle(GetReviewsByProductIdQuery request, CancellationToken cancellationToken)
        {

            var data = await context.ProductReviews
            .Include(pr => pr.Account)
                .Include(pr => pr.ReviewMedias)
                .Where(pr => pr.product_id == request.product_id)
                .Skip((request.page_number - 1) * request.page_size)
                .Take(request.page_size)
                .ToListAsync(cancellationToken);

            var productReviewDtos = mapper.Map<List<ProductReviewDto>>(data);



            foreach (var review in productReviewDtos)
            {
                review.review_medias = mapper.Map<List<ReviewMediaDto>>(data
                    .FirstOrDefault(pr => pr.Id == review.Id)?.ReviewMedias);
            }



            var totalReviews = await context.ProductReviews
                .CountAsync(pr => pr.product_id == request.product_id, cancellationToken);

            return new ResponDataDto<List<ProductReviewDto>>
            {
                data = productReviewDtos,
                total_record = totalReviews,
                page_size = request.page_size,
                page_number = request.page_number,
            };
        }
    }
}