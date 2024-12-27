using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class SaleBillDetailEntity 
    {
        public string Id { get; set; } = null!;
        public string product_detail_id { get; set; } = null!;
        public int quantity { get; set; }
        public string size { get; set; } = null!;
        public string color { get; set; } = null!;
        public  string sale_bill_id { get; set; } = null!;
        public virtual SaleBillEntity SaleBill { get; set; } = null!;
        public virtual ProductDetailEntity ProductDetail { get; set; } = null!;
    }
}