using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;

namespace Application.Common.Dtos
{
    public class ProductReviewDto
    {
        public string Id { get; set; } = null!;
        public string comment { get; set; } = null!;
        public int rating { get; set; }
        public string product_id { get; set; } = null!;
        public DateTime created_at { get; set; }
        public string created_by { get; set; } = null!;
        public virtual AccountDto account { get; set; } = new AccountDto();
        public IEnumerable<ReviewMediaDto> review_medias { get; set; } = new List<ReviewMediaDto>();
    }
}