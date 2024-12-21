using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class OrderItemEntity : BaseEntity
    {
        public int status_order { get; set; }
        public string pay_method { get; set; } = null!;
        public double total_order { get; set; }
        public string seller_id { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<OrderItemDetailEntity> ListOrderItemDetail { get; set; } = null!;
        public virtual ICollection<VoucherUseOrderItem> VoucherUseOrderItems { get; set; } = null!;

    }
}