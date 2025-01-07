using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class VoucherUseSaleBillEntity
    {
        public string Id { get; set; } = null!;
        public string bill_id { get; set; } = null!;
        public string voucher_id { get; set; } = null!;
        public virtual SaleBillEntity SaleBill { get; set; } = null!;
        public virtual VoucherEntity Voucher { get; set; } = null!;
    }
}