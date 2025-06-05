using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class EnvConfiguration
    {
        public string Dev { get; set; } = null!;
        public string Prod { get; set; } = null!;
    }
}