using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class EmailConfiguration
    {
        public string SmtpHost { get; set; } = null!;
        public int SmtpPort { get; set; }
        public string FromEmail { get; set; } = null!;
        public string FromPassword { get; set; } = null!;   
    }
}