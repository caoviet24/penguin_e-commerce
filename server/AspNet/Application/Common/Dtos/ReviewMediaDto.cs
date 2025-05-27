using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class ReviewMediaDto
    {
        public string Id { get; set; } = null!;
        public string review_id { get; set; } = null!;
        public string media_url { get; set; } = null!;
        public string media_type { get; set; } = null!;
        public DateTime created_at { get; set; }
    }
}