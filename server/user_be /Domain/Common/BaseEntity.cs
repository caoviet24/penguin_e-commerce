using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class BaseEntity
    {
        public string Id { get; set; } = null!;
        public DateTime created_at { get; set; } = DateTime.UtcNow;
        public string created_by { get; set; } = null!;
        public DateTime last_updated { get; set; } = DateTime.UtcNow;
        public string updated_by { get; set; } = null!;
        public bool is_deleted { get; set; } = false;

    }
}