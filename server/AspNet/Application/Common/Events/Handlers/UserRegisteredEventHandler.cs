using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Common.Events.Handlers
{
    public class UserRegisteredEventHandler : INotificationHandler<UserRegisteredEvent>
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<UserRegisteredEventHandler> _logger;

        public UserRegisteredEventHandler(IEmailService emailService, ILogger<UserRegisteredEventHandler> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        public async Task Handle(UserRegisteredEvent notification, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Handling user registration event for user: {notification.Username}");
                
                await _emailService.SendWelcomeEmailAsync(
                    notification.Email, 
                    notification.Username);

                _logger.LogInformation($"Welcome email sent successfully for user: {notification.Username}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to handle user registration event for user: {notification.Username}");
                // Don't rethrow to prevent breaking the main registration flow
            }
        }
    }
}