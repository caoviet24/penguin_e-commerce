using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class VoucherUseOrderItem
    {
        public string Id { get; set; } = null!;
        public string order_item_id { get; set; } = null!;
        public string voucher_id { get; set; } = null!;

        public virtual OrderItemEntity OrderItem { get; set; } = null!;
        public virtual VoucherEntity Voucher { get; set; } = null!;


    }
}