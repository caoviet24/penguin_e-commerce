using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Common.Events.Handlers
{
    public class OrderCancelEventHandler(IEmailService emailService, ILogger<OrderCancelEventHandler> logger) : INotificationHandler<OrderCancelEvent>
    {
        public async Task Handle(OrderCancelEvent notification, CancellationToken cancellationToken)
        {
            try
            {
                logger.LogInformation($"Handling order created event for order: {notification.bill.Id}");

                await emailService.SendOrderCancellationToBuyerEmailAsync(
                        notification.booth,
                        notification.user,
                        notification.bill
                    );

                await emailService.SendOrderCancellationToSalerEmailAsync(
                        notification.saler,
                        notification.booth,
                        notification.user,
                        notification.bill
                    );

                logger.LogInformation($"Order cancellation email sent successfully for order: {notification.bill.Id}");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Failed to handle order created event for order: {notification.bill.Id}");
                // Don't rethrow to prevent breaking the main order creation flow
            }
        }
    }
}