using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class OrderItemDto
    {
        public string Id { get; set; } = null!;
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
        public string seller_id { get; set; } = null!;
        public DateTime created_at { get; set; }
        public string buyer_id { get; set; } = null!;
        public string updated_by { get; set; } = null!;
        public DateTime last_updated { get; set; }
        public bool is_deleted { get; set; }
        public virtual ProductDetailDto product_detail { get; set; } = null!;
    }
}