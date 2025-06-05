using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Common.Events.Handlers
{
    public class OrderCreatedEventHandler : INotificationHandler<OrderCreatedEvent>
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<OrderCreatedEventHandler> _logger;

        public OrderCreatedEventHandler(IEmailService emailService, ILogger<OrderCreatedEventHandler> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        public async Task Handle(OrderCreatedEvent notification, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Handling order created event for order: {notification.OrderId}");
                
                await _emailService.SendOrderConfirmationEmailAsync(
                    notification.Email,
                    notification.OrderId,
                    notification.Username,
                    notification.TotalAmount);

                _logger.LogInformation($"Order confirmation email sent successfully for order: {notification.OrderId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to handle order created event for order: {notification.OrderId}");
                // Don't rethrow to prevent breaking the main order creation flow
            }
        }
    }
}