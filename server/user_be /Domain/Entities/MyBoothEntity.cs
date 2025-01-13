using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class MyBoothEntity : BaseEntity
    {
        public string booth_name { get; set; } = null!;
        public string booth_description { get; set; } = null!;
        public string booth_avatar { get; set; } = null!;
        public bool is_active { get; set; }
        public bool is_banned { get; set; }
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<ProductEntity> ListProduct { get; set; } = null!;
        public virtual ICollection<OrderItemEntity> ListOrderItem { get; set; } = null!;
        public virtual ICollection<SaleBillEntity> ListSaleBill { get; set; } = null!;
    }
}