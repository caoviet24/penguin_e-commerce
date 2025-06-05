using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class StatisticalDto
    {
        public string previous { get; set; } = null!;
        public double amount { get; set; }
        public int product_sold { get; set; }
    }
}