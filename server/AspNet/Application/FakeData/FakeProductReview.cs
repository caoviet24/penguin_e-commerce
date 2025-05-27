using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.FakeData
{
    public class FakeProductReviewCommand : IRequest<List<ProductReviewDto>>
    {

    }
    
    public class FakeProductReviewHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<FakeProductReviewCommand, List<ProductReviewDto>>
    {
          private static List<string> VnProductReviews = new List<string>
        {
            "Sản phẩm rất tốt, đúng như mô tả, giao hàng nhanh.",
            "Chất lượng sản phẩm tuyệt vời, tôi rất hài lòng.",
            "Giao hàng nhanh, đóng gói cẩn thận, sẽ ủng hộ shop lần sau.",
            "Sản phẩm đẹp, đúng như hình, giá cả hợp lý.",
            "Chất lượng tương đối ổn so với giá tiền, shop tư vấn nhiệt tình.",
            "Đóng gói sản phẩm rất chắc chắn, hàng không bị hư hỏng.",
            "Tôi rất thích sản phẩm này, sẽ giới thiệu cho bạn bè.",
            "Shop phục vụ tốt, trả lời tin nhắn nhanh, giao hàng đúng hẹn.",
            "Sản phẩm khá ổn, nhưng có thể cải thiện thêm về chất lượng.",
            "Đúng như mô tả, rất hài lòng với sản phẩm này.",
            "Chất lượng sản phẩm tốt, giá cả phải chăng.",
            "Sản phẩm đúng như hình, đóng gói cẩn thận.",
            "Giao hàng hơi chậm nhưng sản phẩm rất tốt.",
            "Mẫu mã đẹp, chất lượng ổn, sẽ mua lại.",
            "Shop tư vấn nhiệt tình, sản phẩm đúng như mô tả.",
            "Sản phẩm vượt quá mong đợi của tôi, rất đẹp và chất lượng.",
            "Hài lòng với sản phẩm, sẽ ủng hộ shop dài dài.",
            "Chất lượng tốt, đáng đồng tiền bát gạo.",
            "Sản phẩm đúng như trong hình, màu sắc đẹp.",
            "Sản phẩm giao đúng hẹn, đóng gói cẩn thận."
        };
        public async Task<List<ProductReviewDto>> Handle(FakeProductReviewCommand request, CancellationToken cancellationToken)
        {
            var fakeReviews = new List<ProductReviewDto>();
            var random = new Random();
            var products = await context.Products.ToListAsync(cancellationToken);
            var accounts = await context.Accounts.Where(a => a.role == "User").ToListAsync(cancellationToken);

            foreach (var prod in products)
            {
                for (int i = 0; i < random.Next(6, 10); i++)
                {
                    var review = new ProductReviewEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        comment = VnProductReviews[random.Next(VnProductReviews.Count)],
                        rating = random.Next(1, 6), // Rating from 1 to 5
                        created_at = DateTime.UtcNow,
                        created_by = accounts[random.Next(accounts.Count)].Id,
                        is_deleted = false,
                        last_updated = DateTime.UtcNow,
                        product_id = prod.Id,
                    };

                    await context.ProductReviews.AddAsync(review, cancellationToken);

                    for(int j = 0; j < random.Next(2, 4); j++)
                    {
                        var reviewMedia = new ReviewMedia
                        {
                            Id = Guid.NewGuid().ToString(),
                            review_id = review.Id,
                            media_url = $"https://picsum.photos/seed/{DateTime.UtcNow.Ticks + i + j}/400/600",
                            media_type = "image",
                            created_at = DateTime.UtcNow,     
                        };
                        await context.ReviewMedias.AddAsync(reviewMedia, cancellationToken);
                    }
                    await context.SaveChangesAsync(cancellationToken);
                    fakeReviews.Add(mapper.Map<ProductReviewDto>(review));
                }
            }

            return fakeReviews;
        }
    }
}