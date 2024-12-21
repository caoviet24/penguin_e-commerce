using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OrderItemDetailEntity
    {
        public string Id { get; set; } = null!;
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
        public  string order_id { get; set; } = null!;
        public virtual OrderItemEntity OrderItem { get; set; } = null!;
        public virtual ProductDetailEntity ProductDetail { get; set; } = null!;
    }
}