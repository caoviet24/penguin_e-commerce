using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class OrderItemDto
    {
        public string Id { get; set; } = null!;
        public int status_order{ get; set; }
        public string pay_method { get; set; } = null!;
        public double total_order { get; set; }
        public string seller_id { get; set; } = null!;
        public string buyer_id { get; set; } = null!;       
        public List<OrderItemDetailDto> list_order_item_detail { get; set; } = new List<OrderItemDetailDto>();
    }
}