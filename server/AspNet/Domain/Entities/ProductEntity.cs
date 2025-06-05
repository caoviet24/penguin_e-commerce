using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class ProductEntity 
    {
        public string Id { get; set; } = null!;
        public DateTime created_at { get; set; } = DateTime.UtcNow;
        public string created_by { get; set; } = null!;
        public DateTime? last_updated { get; set; } = DateTime.UtcNow;
        public string? updated_by { get; set; } = null!;
        public bool is_deleted { get; set; } = false;
        public string product_desc { get; set; } = null!;
        public string status { get; set; } = "AVAILABLE";
        public bool is_active { get; set; } = true;
        public string category_detail_id { get; set; } = null!;
        public virtual CategoryDetailEntity CategoryDetail { get; set; } = null!;
        public virtual BoothEntity MyBooth { get; set; } = null!;
        public virtual ICollection<ProductDetailEntity> ListProductDetail { get; set; } = null!;
        public virtual ICollection<ProductReviewEntity> ProductReviews { get; set; } = null!;

    }
}