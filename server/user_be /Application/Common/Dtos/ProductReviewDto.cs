using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class ProductReviewDto
    {
        public string Id { get; set; } = null!;
        public string content { get; set; } = null!;
        public int rating { get; set; }
        public string product_detail_id { get; set; } = null!;
        public DateTime created_at { get; set; }
        public string created_by { get; set; } = null!;
        public virtual ProductDetailDto product_detail { get; set; } = new ProductDetailDto();
        public virtual UserDto user { get; set; } = new UserDto();
    }
}