using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class ProductReviewEntity : BaseEntity
    {
        public string comment { get; set; } = null!;
        public int rating { get; set; }
        public string product_id { get; set; } = null!;
        public virtual ProductEntity Product { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public ICollection<ReviewMedia> ReviewMedias { get; set; } = new List<ReviewMedia>();

    }
}