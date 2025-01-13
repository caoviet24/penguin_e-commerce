using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class OrderItemEntity : BaseEntity
    {
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
        public string boot_id { get; set; } = null!;
        public virtual MyBoothEntity MyBooth { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ProductDetailEntity ProductDetail { get; set; } = null!;
    }
}