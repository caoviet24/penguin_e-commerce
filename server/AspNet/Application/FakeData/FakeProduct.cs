using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums.status;

namespace Application.FakeData
{
    public class FakeProductCommand : IRequest<List<ProductDto>>
    {
        public int count { get; set; }
    }

    public class FakeProductCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<FakeProductCommand, List<ProductDto>>
    {
        private static List<string> VnProductDescriptions = new List<string>
        {
            "Sản phẩm cao cấp, chất lượng hàng đầu",
            "Thiết kế hiện đại, phù hợp với mọi lứa tuổi",
            "Hàng chính hãng, bảo hành 12 tháng",
            "Sản phẩm bán chạy nhất trong tháng",
            "Chất liệu cao cấp, bền đẹp theo thời gian",
            "Thiết kế tinh tế, sang trọng",
            "Phù hợp với nhu cầu sử dụng hàng ngày",
            "Sản phẩm mới ra mắt, hot trend 2025",
            "Chất lượng vượt trội so với giá thành",
            "Hàng Việt Nam chất lượng cao",
            "Thiết kế nhỏ gọn, tiện lợi khi sử dụng",
            "Phù hợp làm quà tặng cho người thân",
            "Sản phẩm được kiểm định chất lượng nghiêm ngặt",
            "Giá cả hợp lý, phù hợp với mọi đối tượng",
            "Phù hợp sử dụng trong mọi điều kiện thời tiết"
        };

        private static List<string> VnColors = new List<string>
        {
            "Đen", "Trắng", "Đỏ", "Xanh lá", "Xanh dương", "Vàng", "Cam", "Tím",
            "Hồng", "Nâu", "Xám", "Bạc", "Vàng gold", "Xanh navy", "Xanh mint",
            "Be", "Đỏ đô", "Ghi", "Xanh rêu", "Kem"
        };

       
        private List<string> VnSizes1 = new List<string>
        {
            "S", "M", "L", "XL", "XXL", "XXXL",
        };

         private static List<string> VnSize2 = new List<string>
        {
            "38", "39", "40", "41", "42", "43",
            "35", "36", "37", "38", "39",
        };




        public async Task<List<ProductDto>> Handle(FakeProductCommand request, CancellationToken cancellationToken)
        {
            var random = new Random();

            // Get the first 5 booths
            var booths = context.Booths.Take(5).ToList();
            if (booths.Count == 0)
            {
                throw new Exception("No booths found");
            }

            // Get all category details
            var categoryDetails = context.CategoryDetails.ToList();
            if (categoryDetails.Count == 0)
            {
                throw new Exception("No category details found");
            }

            var products = new List<ProductEntity>();
            var productDetails = new List<ProductDetailEntity>();

            // Generate products based on request count
            for (int i = 0; i < request.count; i++)
            {
                // Assign to a random booth from the first 5
                var booth = booths[random.Next(booths.Count)];


                var categoryDetail = categoryDetails[random.Next(categoryDetails.Count)];

                var product = new ProductEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    product_desc = VnProductDescriptions[random.Next(VnProductDescriptions.Count)],
                    status = "INSTOCK",
                    is_active = i % 2 == 0 ? true : false,
                    category_detail_id = categoryDetail.Id,
                    created_at = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    created_by = booth.Id,
                    last_updated = DateTime.UtcNow,
                    updated_by = booth.created_by,
                    is_deleted = false,
                    ListProductDetail = new List<ProductDetailEntity>()
                };

                products.Add(product);

                int detailCount = random.Next(2, 5);
                for (int j = 0; j < detailCount; j++)
                {
                    var color = VnColors[random.Next(VnColors.Count)];
                    var size = random.Next(0, 2) == 0
                        ? string.Join(",", VnSizes1.OrderBy(x => random.Next()).Take(random.Next(2, 4))) 
                        : string.Join(",", VnSize2.OrderBy(x => random.Next()).Take(random.Next(2, 4)));
                    var salePrice = random.Next(50000, 2000000);
                    var promoPrice = (double)(salePrice * 0.9);

                    productDetails.Add(new ProductDetailEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        product_name = $"{categoryDetail.name} {color} {size}",
                        image = $"https://picsum.photos/seed/{DateTime.UtcNow.Ticks + i + j}/400/600",
                        color = color,
                        size = size,
                        sale_price = salePrice,
                        promotional_price = promoPrice,
                        sale_quantity = 0,
                        stock_quantity = random.Next(10, 100),
                        created_at = product.created_at,
                        updated_at = DateTime.UtcNow,
                        product_id = product.Id,
                        is_deleted = false,
                    });
                }
            }

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync(cancellationToken);

            await context.ProductDetails.AddRangeAsync(productDetails);
            await context.SaveChangesAsync(cancellationToken);

            return mapper.Map<List<ProductDto>>(products);



        }
    }


}