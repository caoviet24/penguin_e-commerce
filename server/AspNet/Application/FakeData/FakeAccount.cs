using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Domain.Entities;

namespace Application.FakeData
{
    public class FakeAccountCommand : IRequest<List<AccountDto>>
    {
        public int count { get; set; }
    }
    

    public class FakeAccountCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<FakeAccountCommand, List<AccountDto>>
    {
         private static List<string> VnFirstNames = new List<string>
        {
            "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
            "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đào", "Đinh", "Mai", "Trịnh",
            "Lương", "Hà", "Châu", "Cao", "Quách", "Tạ", "Lưu", "Tô", "Tăng", "Thái"
        };

        private static List<string> VnMiddleAndLastNames = new List<string>
        {
            "Thị Anh", "Văn An", "Tuấn Anh", "Hoàng Anh", "Quốc Anh", "Minh Anh", "Thị Bích", "Thị Chi", 
            "Văn Cường", "Mạnh Cường", "Quốc Cường", "Đức Dũng", "Văn Dũng", "Thị Dung", "Thành Đạt",
            "Đình Điệp", "Văn Đức", "Mạnh Hà", "Thị Hà", "Thị Hải", "Văn Hiếu", "Thị Hiền", 
            "Minh Hoàng", "Văn Hoàng", "Bá Hùng", "Mạnh Hùng", "Văn Hùng", "Thị Hương", "Minh Huệ", 
            "Công Khoa", "Thị Kim", "Văn Khánh", "Minh Khuê", "Thị Lan", "Thị Linh", "Minh Long", 
            "Thị Mai", "Văn Minh", "Thị Mỹ", "Thị Nga", "Thị Ngọc", "Thị Như", "Thị Nhung", 
            "Văn Phong", "Thị Phương", "Văn Quân", "Minh Quang", "Thị Quỳnh", "Văn Sơn", "Thị Thảo", 
            "Văn Thành", "Thị Thủy", "Văn Tâm", "Thị Tâm", "Văn Thanh", "Thị Thanh", "Văn Thắng", 
            "Văn Tiến", "Thị Trang", "Minh Trí", "Văn Trung", "Thị Tuyết", "Đình Tuấn", "Văn Tuấn", 
            "Thị Vân", "Thị Việt", "Văn Việt", "Thị Xuân", "Văn Đại", "Đức Đạt"
        };
        public async Task<List<AccountDto>> Handle(FakeAccountCommand request, CancellationToken cancellationToken)
        {
            var accountDtos = new List<AccountDto>();
            var random = new Random();
            for (int i = 0; i < request.count; i++)
            {
                var firstName = VnFirstNames[random.Next(VnFirstNames.Count)];
                var middleAndLastName = VnMiddleAndLastNames[random.Next(VnMiddleAndLastNames.Count)];
                var fullName = $"{firstName} {middleAndLastName}";


                var account = new AccountEntity()
                {

                    Id = Guid.NewGuid().ToString(),
                    username = $"user{i}",
                    password = BCrypt.Net.BCrypt.HashPassword("1"),
                    role = i % 2 == 0 ? "Saler" : "User",
                    is_banned = false,
                    full_name = fullName,
                    nick_name = fullName.Split(' ').Last(),
                    gender = random.Next(2) == 0 ? "Nam" : "Nữ",
                    birth = DateTime.UtcNow.AddYears(-random.Next(20, 60)),
                    avatar = $"https://example.com/avatar/seller{i}.jpg",
                    address = "Việt Nam",
                    phone = $"09{random.Next(10000000, 99999999)}",
                    created_at = DateTime.UtcNow.AddDays(-random.Next(1, 100)),
                    updated_at = DateTime.UtcNow,
                    is_deleted = false,
                };
                context.Accounts.Add(account);
                await context.SaveChangesAsync(cancellationToken);
                var accountDto = mapper.Map<AccountDto>(account);
                
                accountDtos.Add(accountDto);
            }

            return accountDtos;
        }
    }
}