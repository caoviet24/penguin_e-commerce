using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class AccountEntity
    {
        public required string Id { get; set; }
        public required string username { get; set; }
        public required string password { get; set; }
        public string role { get; set; } = null!;
        public bool is_banned { get; set; }
        public string full_name { get; set; } = null!;
        public string nick_name { get; set; } = null!;
        public string gender { get; set; } = null!;
        public DateTime birth { get; set; }
        public string? avatar { get; set; } = null!;
        public string? address { get; set; } = null!;
        public string? phone { get; set; } = null!;
        public string? email { get; set; } = null!;
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public bool is_deleted { get; set; }
        public virtual RefreshTokenEntity RefreshToken { get; set; } = null!;
        public virtual VerifyAccount VerifyAccount { get; set; } = null!;
        public virtual BoothEntity Booth { get; set; } = null!;
        public virtual ICollection<CategoryEntity> ListCategory { get; set; } = null!;
        public virtual ICollection<OrderItemEntity> ListOrderItem { get; set; } = null!;
        public virtual ICollection<SaleBillEntity> ListSaleBill { get; set; } = null!;
        public virtual ICollection<AddressDeliveryEntity> ListAddressDelivery { get; set; } = null!;
        public virtual ICollection<BackBillEntity> ListBackBill { get; set; } = null!;
        public virtual ICollection<VoucherEntity> ListVoucher { get; set; } = null!;
        public virtual ICollection<ProductReviewEntity> ListProductReview { get; set; } = null!;
        public virtual ICollection<NotifyEntity> ListNotifySender { get; set; } = null!;
        public virtual ICollection<NotifyEntity> ListNotifyReceiver { get; set; } = null!;
        public virtual ICollection<PaymentHistory> ListPaymentHistory { get; set; } = null!;

    }
}