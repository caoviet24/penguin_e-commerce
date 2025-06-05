using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class OverViewDto
    {
        public int? total_bill_success { get; set; }
        public int? total_bill_pending { get; set; }
        public int? total_bill_cancel { get; set; }
        public int? total_bill_back_pending { get; set; }
        public int? total_bill_back_success { get; set; }
        public int? total_bill_back_cancel { get; set; }
        public int? voucher_count_active { get; set; }
        public int? voucher_count_inactive { get; set; }
        public int? voucher_count_deleted { get; set; }
        public int? product_count_active { get; set; }
        public int? product_count_inactive { get; set; }
        public int? product_count_deleted { get; set; }
        public int? product_count_unavailable  {get; set;}
        public int? booth_count_active { get; set; }
        public int? booth_count_inactive { get; set; }
        public int? booth_count_deleted { get; set; }
        public int? booth_count_pending { get; set; }
        public int? booth_count_banned { get; set; }
        public int? account_count { get; set; }
        public int? account_count_banned { get; set; }
        public int? account_count_active { get; set; }
        public int? account_count_deleted { get; set; }
        public int? category_count_deleted { get; set; }
        public int? category_count_active { get; set; }
        
        public int? category_detail_count { get; set; }
    }
}