using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;

namespace Application.Dtos.Account
{
    public class AccountDto
    {
        public string Id { get; set; } = null!;
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
        public string role { get; set; } = null!;
        public bool is_banned { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public bool is_deleted { get; set; }
        public UserDto User { get; set; } = new UserDto();
    }
}