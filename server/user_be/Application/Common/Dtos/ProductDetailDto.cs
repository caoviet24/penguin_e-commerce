using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class ProductDetailDto
    {
        public string Id { get; set; } = null!;
        public string product_name { get; set; } = null!;
        public string image { get; set; } = null!;
        public string color { get; set; } = null!;
        public string size { get; set; } = null!;
        public double price_sale { get; set; }
        public double promotional_price { get; set; }
        public int sale_quantity { get; set; }
        public int stock_quantity { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public required string product_id { get; set; }
    }
}