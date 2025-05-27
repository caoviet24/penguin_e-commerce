using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class VnPayConfigration
    {
         public string TmnCode { get; set; } = null!;
        public string HashSecret { get; set; } = null!;
        public string BaseUrl { get; set; } = null!;
        public string ReturnUrl { get; set; } = null!;
        public string Command { get; set; } = null!;
        public string CurrCode { get; set; } = null!;
        public string Version { get; set; } = null!;
        public string Locale { get; set; } = null!;
        
        // Alias for BaseUrl for backward compatibility with our service implementation
        public string PaymentUrl => BaseUrl;
    }
}