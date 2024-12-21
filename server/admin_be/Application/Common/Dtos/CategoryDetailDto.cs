using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class CategoryDetailDto
    {
        public string Id {get; set;} = null!;
        public string category_detail_name {get; set;} = null!;
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string category_id {get; set;} = null!;
    }
}