using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class CategoryEntity : BaseEntity
    {
        public string category_name { get; set; } = null!;
        public string image { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<CategoryDetailEntity> ListCategoryDetail { get; set; } = null!;
    }
}