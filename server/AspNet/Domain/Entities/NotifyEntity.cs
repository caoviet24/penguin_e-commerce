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
        public string type { get; set; } = null!;
        public string? image { get; set; }
        public string? link { get; set; }
        public string receiver_id { get; set; } = null!;
        public bool is_read { get; set; }
        public virtual AccountEntity NotifySender { get; set; } = null!;
        public virtual AccountEntity NotifyReceiver { get; set; } = null!;
    }
}