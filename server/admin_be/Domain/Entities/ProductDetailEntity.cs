using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ProductDetailEntity
    {
        public string Id { get; set; } = null!;
        public string product_name { get; set; } = null!;
        public string image { get; set; } = null!;
        public string color { get; set; } = null!;
        public string size { get; set; } = null!;
        public double sale_price { get; set; }
        public double promotional_price { get; set; }
        public int sale_quantity { get; set; }
        public int stock_quantity { get; set; }
        public DateTime created_at { get; set; } 
        public DateTime updated_at { get; set; }
        public string product_id { get; set; } = null!;
        public bool is_deleted { get; set; }
        public virtual ProductEntity Product { get; set; } = null!;
        public virtual ICollection<OrderItemEntity> ListOrderItem { get; set; } = null!;
        public virtual ICollection<SaleBillDetailEntity> SaleBillDetails { get; set; } = null!;
        public virtual ICollection<ProductReviewEntity> ProductReviews { get; set; } = null!;

    }
}