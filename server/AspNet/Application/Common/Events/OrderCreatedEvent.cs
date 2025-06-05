using Domain.Common;

namespace Application.Common.Events
{
    public class OrderCreatedEvent : IDomainEvent, INotification
    {
        public string OrderId { get; }
        public string UserId { get; }
        public string Username { get; }
        public string Email { get; }
        public double TotalAmount { get; }
        public DateTime OccurredOn { get; }

        public OrderCreatedEvent(string orderId, string userId, string username, string email, double totalAmount)
        {
            OrderId = orderId;
            UserId = userId;
            Username = username;
            Email = email;
            TotalAmount = totalAmount;
            OccurredOn = DateTime.UtcNow;
        }
    }
}