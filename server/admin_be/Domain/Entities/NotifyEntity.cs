using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Domain.Entities
{
    public class NotifyEntity : BaseEntity
    {
        public string title { get; set; } = null!;
        public string content { get; set; } = null!;
        public string receiver_id { get; set; } = null!;
        public bool is_read { get; set; }
        public bool is_delete { get; set; }
        public virtual AccountEntity Account { get; set; } = null!;
    }
}