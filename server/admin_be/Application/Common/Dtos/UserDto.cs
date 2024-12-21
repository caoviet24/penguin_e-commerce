using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string full_name { get; set; } = null!;
        public string nick_name { get; set; } = null!;
        public string gender { get; set; } = null!;
        public DateTime birth { get; set; }
        public string avatar { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
    }
}