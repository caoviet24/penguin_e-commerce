using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using Net.payOS;
using Net.payOS.Types;

namespace Infrastructure.ExternalService
{
    public class PaymentService(IOptions<PaymentConfiguration> paymentConfiguration) : IPaymentService
    {
        public async Task<PaymentLinkInformation> CancelPayment(int orderCode, string? reason = null)
        {
            PayOS payOS = new PayOS(
                paymentConfiguration.Value.clientId,
                paymentConfiguration.Value.apiKey,
                paymentConfiguration.Value.checksumKey
            );

            PaymentLinkInformation cancelledPaymentLinkInfo;

            if (string.IsNullOrEmpty(reason))
            {
                cancelledPaymentLinkInfo = await payOS.cancelPaymentLink(orderCode);
            }
            else
            {
                cancelledPaymentLinkInfo = await payOS.cancelPaymentLink(orderCode, reason);
            }

            return cancelledPaymentLinkInfo;


        }
        public async Task<CreatePaymentResult> CreatePayment(PaymentPayload payload)
        {
            PayOS payOS = new PayOS(
                paymentConfiguration.Value.clientId,
                paymentConfiguration.Value.apiKey,
                paymentConfiguration.Value.checksumKey
            );

            PaymentData paymentData = new PaymentData(
                Random.Shared.Next(100000, 999999),
                payload.amount,
                payload.description,
                payload.items,
                payload.cancelUrl,
                payload.returnUrl,
                null,
                null,
                null,
                null,
                null,
                null
            );

            CreatePaymentResult result = await payOS.createPaymentLink(paymentData);
            if (result == null)
            {
                throw new Exception("Failed to create payment link");
            }
            return result;
        }

        public async Task<PaymentLinkInformation> GetPaymentLinkInformation(int orderCode)
        {
            PayOS payOS = new PayOS(
                paymentConfiguration.Value.clientId,
                paymentConfiguration.Value.apiKey,
                paymentConfiguration.Value.checksumKey
            );

            PaymentLinkInformation paymentLinkInformation = await payOS.getPaymentLinkInformation(orderCode);
            if (paymentLinkInformation == null)
            {
                throw new Exception("Failed to get payment link information");
            }
            return paymentLinkInformation;
        }
    }
}