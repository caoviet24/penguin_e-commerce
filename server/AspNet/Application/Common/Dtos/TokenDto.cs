using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class TokenDto
    {
        public required string access_token { get; set; }
        public required string refresh_token { get; set; }
    }
}