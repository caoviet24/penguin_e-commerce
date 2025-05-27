using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class PaymentConfiguration
    {
        public string clientId { get; set; } = null!;
        public string apiKey { get; set; } = null!;
        public string checksumKey { get; set; } = null!;
    }
}