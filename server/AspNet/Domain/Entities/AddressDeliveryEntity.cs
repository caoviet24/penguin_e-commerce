using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class AddressDeliveryEntity : BaseEntity
    {
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
        public string full_name { get; set; } = null!;
        public virtual AccountEntity Account { get; set; } = null!;
        public virtual ICollection<SaleBillEntity> ListSaleBill { get; set; } = null!;
    }
}