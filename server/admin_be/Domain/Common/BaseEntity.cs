using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class BaseEntity
    {
        public string Id { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public string created_by { get; set; }
        public DateTime last_updated { get; set; } = DateTime.Now;
        public string updated_by { get; set; }

    }
}