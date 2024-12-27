using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CategoryDetailEntity
    {
        public string Id {get; set;} = null!;
        public string category_detail_name {get; set;} = null!;
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string category_id {get; set;} = null!;
        public virtual CategoryEntity Category {get; set;} = null!;
        public ICollection<ProductEntity> ListProduct {get; set;} = null!;
    }
}