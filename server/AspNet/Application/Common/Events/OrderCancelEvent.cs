using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Application.Common.Events
{
    public class OrderCancelEvent : IDomainEvent, INotification
    {
        public string saler { get; }
        public SaleBillEntity bill { get; }
        public BoothEntity booth { get; }
        public AccountEntity user { get; }
        public DateTime OccurredOn { get; } = DateTime.UtcNow;

        public OrderCancelEvent(string saler, SaleBillEntity bill, BoothEntity booth, AccountEntity user)
        {
            this.saler = saler;
            this.bill = bill;
            this.booth = booth;
            this.user = user;
        }
    }

}