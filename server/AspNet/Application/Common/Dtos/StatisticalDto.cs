using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class StatisticalDto
    {
        public DateTime date { get; set; }
        public double total { get; set; }
        public int products_sold { get; set; }
    }
}