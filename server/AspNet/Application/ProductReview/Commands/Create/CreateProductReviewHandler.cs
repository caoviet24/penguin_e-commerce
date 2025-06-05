using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;

using Domain.Entities;
using MediatR;


namespace Application.ProductReview.Commands.Create
{
    public class CreateProductReviewCommand : IRequest<ProductReviewDto>
    {
        public string bill_id { get; set; } = null!;
        public string comment { get; set; } = null!;
        public int rating { get; set; }
        public string product_id { get; set; } = null!;
        public List<CreateReviewMediaCommand> review_medias { get; set; } = new List<CreateReviewMediaCommand>();
    }

    public class CreateReviewMediaCommand : IRequest<ReviewMediaDto>
    {
        public string media_url { get; set; } = null!;
        public string media_type { get; set; } = null!; 
    }

    public class CreateProductReviewHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<CreateProductReviewCommand, ProductReviewDto>
    {
        public async Task<ProductReviewDto> Handle(CreateProductReviewCommand request, CancellationToken cancellationToken)
        {

            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var newReview = mapper.Map<ProductReviewEntity>(request);

                newReview.Id = Guid.NewGuid().ToString();   
                var result = await context.ProductReviews.AddAsync(newReview, cancellationToken);
                
                if (result == null)
                {
                    throw new Exception("Failed to create product review.");
                }

                foreach (var media in request.review_medias)
                {
                    var reviewMedia = new ReviewMedia
                    {
                        Id = Guid.NewGuid().ToString(),
                        review_id = newReview.Id,
                        media_url = media.media_url,
                        media_type = media.media_type,
                        created_at = DateTime.UtcNow
                    };
                    await context.ReviewMedias.AddAsync(reviewMedia, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                    newReview.ReviewMedias.Add(reviewMedia);
                }

                var checkExitBill = await context.SaleBills.FindAsync(request.bill_id, cancellationToken);
                if (checkExitBill == null)
                {
                    throw new Exception("Bill not found.");
                }

                checkExitBill.is_evaluated = true;
                context.SaleBills.Update(checkExitBill);
                await context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                var productReviewDto = mapper.Map<ProductReviewDto>(newReview);
                productReviewDto.review_medias = mapper.Map<IEnumerable<ReviewMediaDto>>(newReview.ReviewMedias);
                return productReviewDto;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                throw new Exception("An error occurred while creating the product review.", ex);
            }
        }
    }
}