using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class ProductEntity : BaseEntity
    {
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