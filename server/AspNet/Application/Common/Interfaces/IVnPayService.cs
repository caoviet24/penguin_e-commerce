using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Common.Interfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(HttpContext context, PaymentInformationModel model);
        PaymentResponseModel ProcessPaymentResponse(IQueryCollection collections);
    }
}