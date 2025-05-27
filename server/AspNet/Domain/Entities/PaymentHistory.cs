using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class PaymentHistory : BaseEntity
    {
        public double amount { get; set; }
        public string transaction_id { get; set; } = null!;
        public string status { get; set; } = null!;
        public string currency { get; set; } = null!;
        public DateTime paied_at { get; set; }
        public virtual AccountEntity Account { get; set; } = null!;
    }
}