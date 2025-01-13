using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class SaleBillEntity : BaseEntity
    {
        public int status_bill { get; set; }
        public string pay_method { get; set; } = null!;
        public double total_bill { get; set; }
        public string boot_id { get; set; } = null!;
        public string name_receiver { get; set; } = null!;
        public string address_delivery { get; set; } = null!;
        public string phone_delivery { get; set; } = null!;
        public virtual MyBoothEntity MyBooth { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<SaleBillDetailEntity> ListSaleBillDetail { get; set; } = null!;
        public virtual ICollection<VoucherUseSaleBillEntity> ListVoucherUseSaleBill { get; set; } = null!;
    }
}