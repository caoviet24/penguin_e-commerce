using Domain.Common;

namespace Application.Common.Events
{
    public class UserRegisteredEvent : IDomainEvent, INotification
    {
        public string UserId { get; }
        public string Username { get; }
        public string Email { get; }
        public DateTime OccurredOn { get; }

        public UserRegisteredEvent(string userId, string username, string email)
        {
            UserId = userId;
            Username = username;
            Email = email;
            OccurredOn = DateTime.UtcNow;
        }
    }
}