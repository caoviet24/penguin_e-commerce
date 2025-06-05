using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string toEmail, string username);
        Task SendOrderConfirmationEmailAsync(string toEmail, string orderId, string username, double totalAmount);
        Task SendOrderCancellationToBuyerEmailAsync(BoothEntity booth, AccountEntity user, SaleBillEntity bill);
        Task SendOrderCancellationToSalerEmailAsync(string toEmail, BoothEntity booth, AccountEntity user, SaleBillEntity bill);
        Task SendReturnOrderToBuyerEmailAsync(BoothEntity booth, AccountEntity user, SaleBillEntity bill);
        Task SendReturnOrderToSalerEmailAsync(string toEmail, BoothEntity booth, AccountEntity user, SaleBillEntity bill);
    }
}