using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class SaleBillDto
    {
        public string Id { get; set; } = null!;
        public int status_bill { get; set; }
        public string pay_method { get; set; } = null!;
        public double total_bill { get; set; }
        public string name_receiver { get; set; } = null!;
        public string address_receiver{ get; set; } = null!;
        public string phone_receiver { get; set; } = null!;
        public string seller_id { get; set; } = null!;
        public string buyer_id { get; set; } = null!;
        public DateTime created_at { get; set; }
        public string updated_by { get; set; } = null!;
        public DateTime last_updated { get; set; }
        public virtual BoothDto Booth { get; set; } = null!;
        public virtual ICollection<SaleBillDetailDto> list_sale_bill_detail { get; set; } = new List<SaleBillDetailDto>();
        
    }
}