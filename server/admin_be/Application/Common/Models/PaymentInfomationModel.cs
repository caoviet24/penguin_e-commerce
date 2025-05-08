using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Models
{
    public class PaymentInformationModel
    {
        public double Amount { get; set; }
        public string Description { get; set; } = null!;
    }
}