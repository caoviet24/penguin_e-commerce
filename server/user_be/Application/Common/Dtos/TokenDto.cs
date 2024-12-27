using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class TokenDto
    {
        public required string accessToken { get; set; }
        public required string refreshToken { get; set; }
    }
}