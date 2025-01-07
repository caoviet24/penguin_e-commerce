using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class RefreshTokenDto
    {
        public string Id { get; set; } = null!;
        public string refresh_token { get; set; } = null!;
        public DateTime created_at { get; set; }
        public string created_by { get; set; } = null!;
        public DateTime last_updated { get; set; }
        public string updated_by { get; set; } = null!;
    }
}