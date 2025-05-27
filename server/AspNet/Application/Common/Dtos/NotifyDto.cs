using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Application.Common.Dtos
{
    public class NotifyDto : BaseEntity
    {
        public string title { get; set; } = null!;
        public string content { get; set; } = null!;
        public string type { get; set; } = null!;
        public string? image { get; set; }
        public string? link { get; set; }
        public string receiver_id { get; set; } = null!;
        public bool is_read { get; set; }
    }
}