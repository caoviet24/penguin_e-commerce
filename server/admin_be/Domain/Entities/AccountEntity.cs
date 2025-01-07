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
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public virtual UserEntity User { get; set; } = null!;
        public virtual RefreshTokenEntity RefreshToken { get; set; } = null!;
        public virtual VerifyAccount VerifyAccount { get; set; } = null!;
        public virtual ICollection<MyBoothEntity> MyBooth { get; set; } = null!;
        public virtual ICollection<CategoryEntity> ListCategory { get; set; } = null!;
        public virtual ICollection<OrderItemEntity> ListOrderItem { get; set; } = null!;
        public virtual ICollection<SaleBillEntity> ListSaleBill { get; set; } = null!;
        public virtual ICollection<VoucherEntity> ListVoucher { get; set; } = null!;
        public virtual ICollection<ProductReviewEntity> ListProductReview { get; set; } = null!;
        public virtual ICollection<NotifyEntity> ListNotify { get; set; } = null!;

    }
}