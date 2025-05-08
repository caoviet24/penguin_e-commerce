using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Net.payOS.Types;

namespace Application.Common.Dtos
{
    public class PaymentPayload
    {
        public int amount { get; set; }
        public string description { get; set; } = null!;
        public List<ItemData> items { get; set; } = new List<ItemData>();
        public string cancelUrl { get; set; } = null!;
        public string returnUrl { get; set; } = null!;

    }
}