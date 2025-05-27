using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.FakeData
{
    public class FakeBoothCommand : IRequest<List<BoothDto>>
    {
        public int count { get; set; }
    }

    public class FakeBoothCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<FakeBoothCommand, List<BoothDto>>
    {
        private static List<string> VnBoothNames = new List<string>
        {
            "Cửa hàng", "Shop", "Thời trang", "Phụ kiện", "Đồ điện tử", "Mỹ phẩm", "Quà tặng",
            "Thiết bị", "Nội thất", "Đồ gia dụng", "Thực phẩm", "Sách", "Đồ chơi", "Thể thao",
            "Làm đẹp", "Sức khỏe", "Đồ handmade", "Trang sức", "Giày dép", "Túi xách"
        };

        private static List<string> VnCompanyNames = new List<string>
        {
            "Việt Tiến", "Anh Phát", "Minh Châu", "Hoàng Phát", "Đại Thành", "Tân Tiến",
            "Phú Quý", "An Phát", "Thành Công", "Phú Hưng", "Tâm Đức", "Hùng Vương",
            "Phương Đông", "Thái Bình", "Đại Nam", "Hoàng Hà", "Sài Gòn", "Hà Nội",
            "Tiến Phát", "Hoàng Minh", "Quốc Anh", "Phương Nam", "Tân Phú", "Đông Á",
            "Trường An", "Hưng Thịnh"
        };

        public async Task<List<BoothDto>> Handle(FakeBoothCommand request, CancellationToken cancellationToken)
        {
            var random = new Random();
            var accounts = await context.Accounts.Where(a => a.role == "Saler").Take(request.count).ToListAsync(cancellationToken);
            var booths = new List<BoothDto>();

            foreach (var account in accounts)
            {

                string boothType = VnBoothNames[random.Next(VnBoothNames.Count)];
                string companyName = VnCompanyNames[random.Next(VnCompanyNames.Count)];
                string boothName = $"{boothType} {companyName}";
                var booth = new BoothEntity()
                {
                    Id = Guid.NewGuid().ToString(),
                    name = boothName,
                    description = "Chuyên cung cấp các sản phẩm chất lượng cao, giá cả hợp lý.",
                    avatar = $"https://picsum.photos/seed/{DateTime.UtcNow.Ticks}/400/600",
                    is_active = true,
                    is_banned = false,
                    created_at = account.created_at,
                    created_by = account.Id,
                    last_updated = DateTime.UtcNow,
                    updated_by = account.Id,
                    is_deleted = false,
                    Account = account
                };
                var data = context.Booths.Add(booth);
                await context.SaveChangesAsync(cancellationToken);
                booths.Add(mapper.Map<BoothDto>(data.Entity));


            }

            return booths;

        }
    }
}