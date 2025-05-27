using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class SaleBillEntity : BaseEntity
    {
        public string status { get; set; } = null!;
        public string pay_method { get; set; } = null!;
        public double total_bill { get; set; }
        public string booth_id { get; set; } = null!;
        public string address_delivery_id { get; set; } = null!;
        public virtual BoothEntity MyBooth { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual AddressDeliveryEntity AddressDelivery { get; set; } = null!;
        public virtual ICollection<SaleBillDetailEntity> ListSaleBillDetail { get; set; } = null!;
        public virtual ICollection<VoucherUseSaleBillEntity> ListVoucherUseSaleBill { get; set; } = null!;
        public virtual ICollection<BackBillEntity> ListBackBill { get; set; } = null!;
    }
}