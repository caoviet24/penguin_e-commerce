using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class BoothDto
    {
        public string Id { get; set; } = null!;
        public string booth_name { get; set; } = null!;
        public string booth_description { get; set; } = null!;
        public string booth_avatar { get; set; } = null!;
        public bool is_active { get; set; }
        public Boolean is_banned { get; set; }
        public DateTime created_at { get; set; }
        public string created_by { get; set; } = null!;
        public DateTime updated_at { get; set; }
        public string updated_by { get; set; } = null!;
        public bool is_deleted { get; set; }
    }
}