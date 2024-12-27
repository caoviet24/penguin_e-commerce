using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class ProductReviewEntity : BaseEntity
    {
        public string content { get; set; } = null!;
        public int rating { get; set; }
        public string product_detail_id { get; set; } = null!;
        public virtual ProductDetailEntity ProductDetail { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
    }
}