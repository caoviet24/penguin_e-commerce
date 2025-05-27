using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class BoothEntity : BaseEntity
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
        public string avatar { get; set; } = null!;
        public bool is_active { get; set; } = false;
        public bool is_closed { get; set; } = true;
        public bool is_banned { get; set; } = false;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<ProductEntity> ListProduct { get; set; } = null!;
        public virtual ICollection<OrderItemEntity> ListOrderItem { get; set; } = null!;
        public virtual ICollection<SaleBillEntity> ListSaleBill { get; set; } = null!;
        public virtual ICollection<BackBillEntity> ListBackBill { get; set; } = null!;
    }
}