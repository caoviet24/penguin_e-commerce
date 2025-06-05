using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Configurations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services
{
    public class EmailService(
        IOptions<EmailConfiguration> emailConfiguration,
        IOptions<EnvConfiguration> envConfiguration,
        ILogger<EmailService> logger
    ) : IEmailService
    {

        public async Task SendWelcomeEmailAsync(string toEmail, string username)
        {
            try
            {
                var subject = "Chào mừng bạn đến với Penguin E-commerce!";
                var body = $@"
                    <h2>Xin chào {username}!</h2>
                    <p>Chào mừng bạn đến với hệ thống Penguin E-commerce.</p>
                    <p>Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu mua sắm ngay bây giờ!</p>
                    <p>Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi.</p>
                    <a href='{envConfiguration.Value.Dev}/sign-in' style='display:inline-block; padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;'>Đăng nhập ngay</a>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Penguin E-commerce</p>
                ";

                await SendEmailAsync(toEmail, subject, body);
                logger.LogInformation($"Welcome email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to send welcome email to {toEmail}");
                throw;
            }
        }

        public async Task SendOrderConfirmationEmailAsync(string toEmail, string orderId, string username, double totalAmount)
        {
            try
            {
                var subject = "Xác nhận đơn hàng thành công";
                var body = $@"
                    <h2>Xin chào {username}!</h2>
                    <p>Cảm ơn bạn đã đặt hàng tại Penguin E-commerce.</p>
                    <p><strong>Thông tin đơn hàng:</strong></p>
                    <ul>
                        <li>Mã đơn hàng: <strong>{orderId}</strong></li>
                        <li>Tổng tiền: <strong>{totalAmount:C}</strong></li>
                        <li>Trạng thái: <strong>Đang xử lý</strong></li>
                    </ul>
                    <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất và thông báo khi có cập nhật.</p>
                    <p>Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản của mình.</p>
                    <a href='{envConfiguration.Value.Dev}/purchase' style='display:inline-block; padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;'>Theo dõi đơn hàng</a>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Penguin E-commerce</p>
                ";

                await SendEmailAsync(toEmail, subject, body);
                logger.LogInformation($"Order confirmation email sent successfully to {toEmail} for order {orderId}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to send order confirmation email to {toEmail} for order {orderId}");
                throw;
            }
        }

        public async Task SendOrderCancellationToBuyerEmailAsync(BoothEntity booth, AccountEntity user, SaleBillEntity bill)
        {
            try
            {
                var subject = "Thông báo hủy đơn hàng";
                var body = $@"
                    <h2>Xin chào người dùng {user.nick_name}!</h2>
                    <p>Chúng tôi xin thông báo yêu cầu hủy đơn hàng.</p>
                    <p><strong>Thông tin đơn hàng đã hủy:</strong></p>
                    <ul>
                        <li>Mã đơn hàng: <strong>{bill.Id}</strong></li>
                        <li>Trạng thái: <strong>Đã hủy</strong></li>
                        <li>Người dùng: <strong>{user.username}</strong></li>
                        <li>Ngày đặt: <strong>{bill.created_at.ToString("dd/MM/yyyy")}</strong></li>
                        <li>Tổng tiền: <strong>{bill.total_bill:C}</strong></li>
                    </ul>
                    <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của Penguin E-commerce.</p>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Penguin E-commerce</p>
                ";

                if (!string.IsNullOrEmpty(user.email))
                {
                    await SendEmailAsync(user.email, subject, body);
                    logger.LogInformation($"Order cancellation email sent successfully to {user.email} for order {bill.Id}");
                }
                else
                {
                    logger.LogWarning($"Could not send cancellation email for order {bill.Id} - user email is null or empty");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to send order cancellation email to {user.email} for order {bill.Id}");
                throw;
            }
        }

        public async Task SendOrderCancellationToSalerEmailAsync(string toEmail, BoothEntity booth, AccountEntity user, SaleBillEntity bill)
        {
            try
            {
                var subject = "Thông báo người dùng đơn hàng";
                var body = $@"
                    <h2>Xin chào cửa hàng {booth.name}!</h2>
                    <p>Chúng tôi xin thông báo người dùng {user.username} đã hủy đơn hàng.</p>
                    <p><strong>Thông tin đơn hàng đã hủy:</strong></p>
                    <ul>
                        <li>Mã đơn hàng: <strong>{bill.Id}</strong></li>
                        <li>Trạng thái: <strong>Đã hủy</strong></li>
                        <li>Người dùng: <strong>{user.username}</strong></li>
                        <li>Ngày đặt: <strong>{bill.created_at.ToString("dd/MM/yyyy")}</strong></li>
                        <li>Tổng tiền: <strong>{bill.total_bill:C}</strong></li>
                    </ul>
                    <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của Penguin E-commerce.</p>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Penguin E-commerce</p>
                ";

                await SendEmailAsync(toEmail, subject, body);
                logger.LogInformation($"Order cancellation email sent successfully to {toEmail} for order {bill.Id}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to send order cancellation email to {toEmail} for order {bill.Id}");
                throw;
            }
        }

        public async Task SendReturnOrderToBuyerEmailAsync(BoothEntity booth, AccountEntity user, SaleBillEntity bill)
        {
            try
            {
                var subject = "Thông báo yêu cầu trả hàng";
                var body = $@"
                    <h2>Xin chào người dùng {user.nick_name}!</h2>
                    <p>Chúng tôi xin thông báo yêu cầu trả hàng.</p>
                    <p><strong>Thông tin đơn hàng:</strong></p>
                    <ul>
                        <li>Mã đơn hàng: <strong>{bill.Id}</strong></li>
                        <li>Trạng thái: <strong>Chờ xử lý</strong></li>
                        <li>Người dùng: <strong>{user.username}</strong></li>
                        <li>Ngày đặt: <strong>{bill.created_at.ToString("dd/MM/yyyy")}</strong></li>
                        <li>Tổng tiền: <strong>{bill.total_bill:C}</strong></li>
                    </ul>
                    <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của Penguin E-commerce.</p>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Penguin E-commerce</p>
                ";

                if (!string.IsNullOrEmpty(user.email))
                {
                    await SendEmailAsync(user.email, subject, body);
                    logger.LogInformation($"Order cancellation email sent successfully to {user.email} for order {bill.Id}");
                }
                else
                {
                    logger.LogWarning($"Could not send cancellation email for order {bill.Id} - user email is null or empty");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to send order cancellation email to {user.email} for order {bill.Id}");
                throw;
            }
        }

        public async Task SendReturnOrderToSalerEmailAsync(string toEmail, BoothEntity booth, AccountEntity user, SaleBillEntity bill)
        {
            try
            {
                var subject = "Thông báo yêu cầu trả hàng";
                var body = $@"
                    <h2>Xin chào cửa hàng {booth.name}!</h2>
                    <p>Chúng tôi xin thông báo người dùng {user.username} đã yêu cầu trả hàng.</p>
                    <p><strong>Thông tin đơn hàng đã yêu cầu trả:</strong></p>
                    <ul>
                        <li>Mã đơn hàng: <strong>{bill.Id}</strong></li>
                        <li>Trạng thái: <strong>Chờ xử lý</strong></li>
                        <li>Người dùng: <strong>{user.username}</strong></li>
                        <li>Ngày đặt: <strong>{bill.created_at.ToString("dd/MM/yyyy")}</strong></li>
                        <li>Tổng tiền: <strong>{bill.total_bill:C}</strong></li>
                    </ul>
                    <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của Penguin E-commerce.</p>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Penguin E-commerce</p>
                ";

                await SendEmailAsync(toEmail, subject, body);
                logger.LogInformation($"Order cancellation email sent successfully to {toEmail} for order {bill.Id}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to send order cancellation email to {toEmail} for order {bill.Id}");
                throw;
            }
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrEmpty(emailConfiguration.Value.FromEmail) || string.IsNullOrEmpty(emailConfiguration.Value.FromPassword))
            {
                logger.LogWarning("Email configuration is missing. Email not sent.");
                return;
            }

            logger.LogInformation($"Sending email from {emailConfiguration.Value.FromEmail} passsword: {emailConfiguration.Value.FromPassword} via {emailConfiguration.Value.SmtpHost}:{emailConfiguration.Value.SmtpPort}");


            using var client = new SmtpClient(emailConfiguration.Value.SmtpHost, emailConfiguration.Value.SmtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(emailConfiguration.Value.FromEmail, emailConfiguration.Value.FromPassword)
            };

            var mailMessage = new MailMessage(emailConfiguration.Value.FromEmail, toEmail, subject, body)
            {
                IsBodyHtml = true
            };

            await client.SendMailAsync(mailMessage);
        }


    }
}