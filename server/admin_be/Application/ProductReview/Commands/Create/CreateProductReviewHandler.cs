using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Interface;
using MediatR;
using WebApi.DBHelper;

namespace Application.ProductReview.Commands.Create
{
    public class CreateProductReviewCommand : IRequest<ProductReviewDto>
    {
        public string content { get; set; } = null!;
        public int rating { get; set; }
        public string product_detail_id { get; set; } = null!;
    }
    public class CreateProductReviewHandler(IDbHelper dbHelper) : IRequestHandler<CreateProductReviewCommand, ProductReviewDto>
    {
        public async Task<ProductReviewDto> Handle(CreateProductReviewCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceByUserAsync<ProductReviewDto>
            (
                "sp_create_review_product",
                new
                {
                    Id = Guid.NewGuid().ToString(),
                    content = request.content,
                    rating = request.rating,
                    product_detail_id = request.product_detail_id,
                }
            );

            return data;
        }
    }
}