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
        public int status { get; set; }
        public string category_detail_id { get; set; } = null!;
        public virtual CategoryDetailEntity CategoryDetail { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<ProductDetailEntity> ListProductDetail { get; set; } = null!;
    }
}