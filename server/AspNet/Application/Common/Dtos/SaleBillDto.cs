using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class SaleBillDto
    {
        public string Id { get; set; } = null!;
        public string status { get; set; } = null!;
        public string pay_method { get; set; } = null!;
        public double total_bill { get; set; }
        public string seller_id { get; set; } = null!;
        public string buyer_id { get; set; } = null!;
        public bool is_evaluated { get; set; } 
        public DateTime created_at { get; set; }
        public string updated_by { get; set; } = null!;
        public DateTime last_updated { get; set; }
        public bool is_deleted { get; set; }
        public virtual BoothDto booth { get; set; } = null!;
        public virtual DeliveryAddressDto delivery_address { get; set; } = null!;
        public virtual BackBillDto back_bill { get; set; } = null!;
        public virtual ICollection<SaleBillDetailDto> list_sale_bill_detail { get; set; } = new List<SaleBillDetailDto>();
        
    }
}