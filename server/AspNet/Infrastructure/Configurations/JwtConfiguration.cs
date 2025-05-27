using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class JwtConfiguration
    {
        public string AccessKey { get; set; } = null!;
        public int AccessExpiresInDay { get; set; }
        public string RefreshKey { get; set; } = null!;
        public int RefreshExpiresInDay { get; set; }
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
    }
}