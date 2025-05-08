using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Net.payOS.Types;

namespace Application.Common.Interfaces
{
    public interface IPaymentService
    {
        Task<CreatePaymentResult> CreatePayment(PaymentPayload payload);
        Task<PaymentLinkInformation> GetPaymentLinkInformation(int orderCode);
        Task<PaymentLinkInformation> CancelPayment(int orderCode, string? reason = null);
    }
}