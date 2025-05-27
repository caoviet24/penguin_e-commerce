using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos;
using Domain.Entities;

namespace Application.FakeData
{
    public class FakeCategoryCommand : IRequest<List<CategoryDto>>
    {
        public int count { get; set; }
    }
    public class FakeCategoryCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<FakeCategoryCommand, List<CategoryDto>>
    {
        private static List<string> VnCategoryNames = new List<string>
        {
            "Thời trang nam", "Thời trang nữ", "Điện thoại", "Máy tính", "Thiết bị điện tử",
            "Đồ gia dụng", "Sách & Văn phòng phẩm", "Mẹ & Bé", "Thực phẩm & Đồ uống",
            "Chăm sóc sức khỏe", "Làm đẹp", "Thể thao & Du lịch", "Ô tô & Xe máy",
            "Đồng hồ", "Trang sức", "Giày dép nam", "Giày dép nữ", "Túi xách", "Đồ chơi",
            "Nhà cửa & Đời sống"
        };

        private static List<Dictionary<string, List<string>>> VnCategoryDetailNames = new List<Dictionary<string, List<string>>>
        {
            // Thời trang nam
            new Dictionary<string, List<string>> {
                { "Thời trang nam", new List<string> {
                    "Áo thun nam", "Áo sơ mi nam", "Quần jean nam", "Quần kaki nam",
                    "Áo khoác nam", "Đồ vest nam", "Áo polo nam"
                }}
            },
            // Thời trang nữ
            new Dictionary<string, List<string>> {
                { "Thời trang nữ", new List<string> {
                    "Áo thun nữ", "Áo sơ mi nữ", "Váy đầm", "Quần jean nữ",
                    "Áo khoác nữ", "Đồ ngủ", "Đồ lót nữ"
                }}
            },
            // Điện thoại
            new Dictionary<string, List<string>> {
                { "Điện thoại", new List<string> {
                    "Điện thoại Samsung", "Điện thoại iPhone", "Điện thoại Xiaomi",
                    "Điện thoại OPPO", "Điện thoại Vivo", "Phụ kiện điện thoại"
                }}
            },
            // Máy tính
            new Dictionary<string, List<string>> {
                { "Máy tính", new List<string> {
                    "Laptop", "Máy tính bảng", "Máy tính để bàn", "Linh kiện máy tính",
                    "Phụ kiện máy tính", "Màn hình"
                }}
            },
            // Thiết bị điện tử
            new Dictionary<string, List<string>> {
                { "Thiết bị điện tử", new List<string> {
                    "Tivi", "Loa & Âm thanh", "Máy ảnh", "Máy quay phim",
                    "Thiết bị thông minh", "Máy chơi game"
                }}
            },
            // Đồ gia dụng
            new Dictionary<string, List<string>> {
                { "Đồ gia dụng", new List<string> {
                    "Tủ lạnh", "Máy giặt", "Máy lọc không khí", "Quạt điện",
                    "Nồi cơm điện", "Bếp điện"
                }}
            },
            // Sách & Văn phòng phẩm
            new Dictionary<string, List<string>> {
                { "Sách & Văn phòng phẩm", new List<string> {
                    "Sách giáo khoa", "Truyện tranh", "Tiểu thuyết", "Sách kinh tế",
                    "Bút & Viết", "Vở & Giấy"
                }}
            },
            // Mẹ & Bé
            new Dictionary<string, List<string>> {
                { "Mẹ & Bé", new List<string> {
                    "Tã & Bỉm", "Đồ dùng cho bé", "Sữa & Thực phẩm", "Đồ chơi cho bé",
                    "Quần áo bé trai", "Quần áo bé gái"
                }}
            },
            // Thực phẩm & Đồ uống
            new Dictionary<string, List<string>> {
                { "Thực phẩm & Đồ uống", new List<string> {
                    "Đồ khô", "Đồ uống", "Bánh kẹo", "Thực phẩm đông lạnh",
                    "Gia vị", "Thực phẩm chức năng"
                }}
            },
            // Chăm sóc sức khỏe
            new Dictionary<string, List<string>> {
                { "Chăm sóc sức khỏe", new List<string> {
                    "Thực phẩm chức năng", "Dụng cụ y tế", "Vật tư y tế", "Thuốc",
                    "Máy massage", "Thiết bị theo dõi sức khỏe"
                }}
            },
            // Làm đẹp
            new Dictionary<string, List<string>> {
                { "Làm đẹp", new List<string> {
                    "Trang điểm", "Chăm sóc da", "Chăm sóc tóc", "Nước hoa",
                    "Dụng cụ làm đẹp", "Bộ sản phẩm làm đẹp"
                }}
            },
            // Thể thao & Du lịch
            new Dictionary<string, List<string>> {
                { "Thể thao & Du lịch", new List<string> {
                    "Đồ tập gym", "Đồ bơi", "Đồ thể thao", "Vali & Túi du lịch",
                    "Dụng cụ thể thao", "Đồ cắm trại"
                }}
            },
            // Ô tô & Xe máy
            new Dictionary<string, List<string>> {
                { "Ô tô & Xe máy", new List<string> {
                    "Phụ tùng ô tô", "Phụ tùng xe máy", "Phụ kiện ô tô", "Phụ kiện xe máy",
                    "Đồ chơi xe", "Dầu nhớt & Phụ gia"
                }}
            },
            // Đồng hồ
            new Dictionary<string, List<string>> {
                { "Đồng hồ", new List<string> {
                    "Đồng hồ nam", "Đồng hồ nữ", "Đồng hồ trẻ em", "Đồng hồ thông minh",
                    "Phụ kiện đồng hồ", "Bộ sưu tập đồng hồ"
                }}
            },
            // Trang sức
            new Dictionary<string, List<string>> {
                { "Trang sức", new List<string> {
                    "Nhẫn", "Dây chuyền", "Lắc tay", "Bông tai",
                    "Trang sức cưới", "Đá quý"
                }}
            },
            // Giày dép nam
            new Dictionary<string, List<string>> {
                { "Giày dép nam", new List<string> {
                    "Giày thể thao nam", "Giày tây nam", "Giày lười nam", "Dép nam",
                    "Sandal nam", "Phụ kiện giày nam"
                }}
            },
            // Giày dép nữ
            new Dictionary<string, List<string>> {
                { "Giày dép nữ", new List<string> {
                    "Giày cao gót", "Giày thể thao nữ", "Giày búp bê", "Dép nữ",
                    "Sandal nữ", "Phụ kiện giày nữ"
                }}
            },
            // Túi xách
            new Dictionary<string, List<string>> {
                { "Túi xách", new List<string> {
                    "Túi xách nữ", "Túi xách nam", "Balo", "Túi đeo chéo",
                    "Vali du lịch", "Ví"
                }}
            },
            // Đồ chơi
            new Dictionary<string, List<string>> {
                { "Đồ chơi", new List<string> {
                    "Đồ chơi cho bé trai", "Đồ chơi cho bé gái", "Đồ chơi giáo dục", "Đồ chơi mô hình",
                    "Đồ chơi điện tử", "Đồ chơi thể thao"
                }}
            },
            // Nhà cửa & Đời sống
            new Dictionary<string, List<string>> {
                { "Nhà cửa & Đời sống", new List<string> {
                    "Đồ dùng nhà bếp", "Đồ dùng phòng tắm", "Đồ dùng phòng ngủ", "Đồ nội thất",
                    "Đồ trang trí", "Vật dụng gia đình"
                }}
            }
        };
        public async Task<List<CategoryDto>> Handle(FakeCategoryCommand request, CancellationToken cancellationToken)
        {
            var random = new Random();
            var adminAccount = context.Accounts.FirstOrDefault(a => a.role == "Admin");

            if (adminAccount == null)
            {
                throw new Exception("Admin account not found");
            }

            var categories = new List<CategoryEntity>();
            var categoryDetails = new List<CategoryDetailEntity>();

            // Select 20 random categories
            var selectedCategoryNames = VnCategoryNames.OrderBy(x => random.Next()).Take(20).ToList();

            foreach (var categoryName in selectedCategoryNames)
            {
                var category = new CategoryEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    name = categoryName,
                    image = $"https://example.com/category/{categoryName.Replace(" ", "-").ToLower()}.jpg",
                    created_at = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    created_by = adminAccount.Id,
                    last_updated = DateTime.UtcNow,
                    updated_by = adminAccount.Id,
                    is_deleted = false,
                    ListCategoryDetail = new List<CategoryDetailEntity>()
                };

                categories.Add(category);

                // Find the matching category details
                var detailsDict = VnCategoryDetailNames.FirstOrDefault(d => d.Keys.FirstOrDefault() == categoryName);
                if (detailsDict != null)
                {
                    var details = detailsDict[detailsDict.Keys.First()];
                    int numDetails = random.Next(5, Math.Min(7, details.Count + 1));

                    var selectedDetails = details.OrderBy(x => random.Next()).Take(numDetails).ToList();

                    foreach (var detailName in selectedDetails)
                    {
                        categoryDetails.Add(new CategoryDetailEntity
                        {
                            Id = Guid.NewGuid().ToString(),
                            name = detailName,
                            created_at = category.created_at,
                            updated_at = DateTime.UtcNow,
                            category_id = category.Id,
                            is_deleted = false
                        });
                    }
                }
                else
                {
                    // Fallback for categories without predefined details
                    for (int i = 1; i <= random.Next(5, 8); i++)
                    {
                        categoryDetails.Add(new CategoryDetailEntity
                        {
                            Id = Guid.NewGuid().ToString(),
                            name = $"{categoryName} loại {i}",
                            created_at = category.created_at,
                            updated_at = DateTime.UtcNow,
                            category_id = category.Id,
                            is_deleted = false,
                        });
                    }
                }



            }
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync(cancellationToken);

            await context.CategoryDetails.AddRangeAsync(categoryDetails);
            await context.SaveChangesAsync(cancellationToken);
            return mapper.Map<List<CategoryDto>>(categories);
        }
    }
}