using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using Domain.Common;

namespace Application.Common.Dtos
{
    public class BackBillDto : BaseEntity
    {
        public string bill_id { get; set; } = null!;
        public string reason_back { get; set; } = null!;
        public string? video { get; set; } = null!;
        public string? image { get; set; }
        public string booth_id { get; set; } = null!;
        public string reply_content { get; set; } = null!;
        public string? reply_image { get; set; }
        public string? reply_video { get; set; }
        public virtual AccountDto account { get; set; } = null!;
    }
}