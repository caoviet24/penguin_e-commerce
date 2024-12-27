using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class VoucherEntity : BaseEntity
    {
        public string voucher_type { get; set; } = null!;
        public string voucher_name { get; set; } = null!;
        public string voucher_code { get; set; } = null!;
        public string apply_for { get; set; } = null!;
        public DateTime expiry_date { get; set; }
        public int quantity_remain { get; set; }
        public int quantity_used { get; set; }
        public Double discount { get; set; }
        public string type_discount { get; set; } = null!;
        public int status_voucher { get; set; }
        public virtual MyBoothEntity MyBooth { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<VoucherUseOrderItem> VoucherUseOrderItems { get; set; } = null!;
    }
}