using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.Dtos
{
    public class PaymentResponseModel
    {
        public bool Success { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string OrderDescription { get; set; } = null!;
        public string OrderId { get; set; } = null!;
        public string PaymentId { get; set; } = null!;
        public string TransactionId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string VnPayResponseCode { get; set; } = null!;
    }
}