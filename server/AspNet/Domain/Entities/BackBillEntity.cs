using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class BackBillEntity : BaseEntity
    {
        public string bill_id { get; set; } = null!;
        public string reason_back { get; set; } = null!;
        public string? video { get; set; } = null!;
        public string? image { get; set; }
        public string booth_id { get; set; } = null!;
        public string? reply_content { get; set; } = null!;
        public string? reply_image { get; set; }
        public string? reply_video { get; set; }
        public virtual SaleBillEntity SaleBill { get; set; } = null!;
        public virtual BoothEntity Booth { get; set; } = null!;
        public virtual AccountEntity Buyer { get; set; } = null!;
    }
}