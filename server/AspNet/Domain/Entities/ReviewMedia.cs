using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ReviewMedia
    {
        public string Id { get; set; } = null!;
        public string review_id { get; set; } = null!;
        public string media_url { get; set; } = null!;
        public string media_type { get; set; } = null!; // e.g., "image", "video"
        public DateTime created_at { get; set; }
        public virtual ProductReviewEntity ProductReview { get; set; } = null!;
    }
}