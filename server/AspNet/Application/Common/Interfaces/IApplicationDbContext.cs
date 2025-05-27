using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext : IDisposable
    {
        DbSet<AccountEntity> Accounts { get; set; }
        DbSet<AddressDeliveryEntity> AddressDeliveries { get; set; }
        DbSet<BoothEntity> Booths { get; set; }
        DbSet<CategoryEntity> Categories { get; set; }
        DbSet<CategoryDetailEntity> CategoryDetails { get; set; }
        DbSet<ProductEntity> Products { get; set; }
        DbSet<ProductDetailEntity> ProductDetails { get; set; }
        DbSet<ProductReviewEntity> ProductReviews { get; set; }
        DbSet<ReviewMedia> ReviewMedias { get; set; }
        DbSet<OrderItemEntity> OrderItems { get; set; }
        DbSet<VoucherEntity> Vouchers { get; set; }
        DbSet<VoucherUseSaleBillEntity> VoucherUseSaleBills { get; set; }
        DbSet<SaleBillEntity> SaleBills { get; set; }
        DbSet<SaleBillDetailEntity> SaleBillDetails { get; set; }
        DbSet<BackBillEntity> BackBills { get; set; }
        DbSet<NotifyEntity> Notifies { get; set; }
        DbSet<RefreshTokenEntity> RefreshTokens { get; set; }
        DbSet<VerifyAccount> VerifyAccounts { get; set; }

        DbSet<PaymentHistory> PaymentHistories { get; set; }
        
        DatabaseFacade Database { get; }
        EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}