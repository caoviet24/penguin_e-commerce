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
        public string product_desc { get; set; } = null!;
        public int status { get; set; }
        public string category_detail_id { get; set; } = null!;
        public DateTime created_at { get; set; }
        public string booth_id { get; set; } = null!;
        public DateTime last_updated { get; set; }
        public string updated_by { get; set; } = null!;
        public virtual CategoryDetailEntity CategoryDetail { get; set; } = null!;
        public virtual MyBoothEntity MyBooth { get; set; } = null!;
        public virtual ICollection<ProductDetailEntity> ListProductDetail { get; set; } = null!;
    }
}