using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos.ResponData
{
    public class ResponDataDto
    {
        public long total_record { get; set; }
        public int page_number { get; set; }
        public int page_size { get; set; }
        public dynamic data { get; set; } = null!;
    }
}