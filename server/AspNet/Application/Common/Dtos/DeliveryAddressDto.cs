using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Application.Common.Dtos
{
    public class DeliveryAddressDto : BaseEntity
    {
        public string address { get; set; } = null!;
        public string phone { get; set; } = null!;
        public string full_name { get; set; } = null!;
    }
}