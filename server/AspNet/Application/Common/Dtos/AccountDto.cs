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
        public string full_name { get; set; } = null!;
        public string nick_name { get; set; } = null!;
        public string gender { get; set; } = null!;
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public bool is_deleted { get; set; }
    }
}