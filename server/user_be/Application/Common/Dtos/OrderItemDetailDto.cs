using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class OrderItemDetailDto
    {
        public string Id { get; set; } = null!;
        public string product_detail_id { get; set; } = null!;
        public string product_name { get; set; } = null!;
        public int quantity { get; set; }
        public double sale_price { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
        
    }
}