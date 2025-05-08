using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Application.Common.Models;
using Infrastructure.Configration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using VNPay.NetCore;
using System.Text;
using System.Net;

namespace Infrastructure.ExternalService
{
    public class VnPayService : IVnPayService
    {
        private readonly VnPayConfigration _vnPayConfig;
        
        public VnPayService(IOptions<VnPayConfigration> vnPayConfig)
        {
            _vnPayConfig = vnPayConfig.Value;
        }
        
        public string CreatePaymentUrl(HttpContext context, PaymentInformationModel model)
        {
            var vnpay = new VnPayLibrary();
            
            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", _vnPayConfig.TmnCode);
            vnpay.AddRequestData("vnp_Amount", (model.Amount * 100).ToString()); // Convert to VND (smallest unit)
            
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", "vn");
            
            vnpay.AddRequestData("vnp_OrderInfo", model.Description);
            vnpay.AddRequestData("vnp_OrderType", "other");
            
            // Generate unique order ID
            var orderId = DateTime.Now.Ticks.ToString();
            vnpay.AddRequestData("vnp_TxnRef", orderId);
            
            // Return URL
            vnpay.AddRequestData("vnp_ReturnUrl", _vnPayConfig.ReturnUrl);
            
            string paymentUrl = vnpay.CreateRequestUrl(_vnPayConfig.PaymentUrl, _vnPayConfig.HashSecret);
            
            return paymentUrl;
        }

        public PaymentResponseModel ProcessPaymentResponse(IQueryCollection collections)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value);
                }
            }
            
            var orderId = collections.FirstOrDefault(k => k.Key == "vnp_TxnRef").Value.ToString();
            var vnpayTranId = collections.FirstOrDefault(k => k.Key == "vnp_TransactionNo").Value.ToString();
            var vnpResponseCode = collections.FirstOrDefault(k => k.Key == "vnp_ResponseCode").Value.ToString();
            
            bool checkSignature = vnpay.ValidateSignature(
                collections.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value.ToString(),
                _vnPayConfig.HashSecret
            );
            
            // 00 = Payment success
            bool success = checkSignature && vnpResponseCode == "00";
            
            return new PaymentResponseModel
            {
                Success = success,
                PaymentMethod = "VnPay",
                OrderDescription = collections.FirstOrDefault(k => k.Key == "vnp_OrderInfo").Value.ToString(),
                OrderId = orderId,
                PaymentId = vnpayTranId,
                TransactionId = vnpayTranId,
                Token = collections.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value.ToString(),
                VnPayResponseCode = vnpResponseCode
            };
        }

        private string GetIpAddress(HttpContext context)
        {
            string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1")
            {
                ipAddress = "127.0.0.1";
            }
            
            return ipAddress;
        }
    }
}
