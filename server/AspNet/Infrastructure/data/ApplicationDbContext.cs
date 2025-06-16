using Application.Common.Dtos;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{

        private readonly IConfiguration? _configuration;
        public ApplicationDbContext() { }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) : base(options)
        {
                _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
                base.OnConfiguring(optionsBuilder);

                // optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));

                optionsBuilder.UseNpgsql(_configuration?.GetConnectionString("DefaultConnection") ??
                    "Host=localhost;Port=5432;Database=penguin;Username=portgre;Password=123;Pooling=true;SSL Mode=Require;Trust Server Certificate=true");
        }

        public DbSet<AccountEntity> Accounts { get; set; } = null!;
        public DbSet<BoothEntity> Booths { get; set; } = null!;
        public DbSet<CategoryEntity> Categories { get; set; } = null!;
        public DbSet<CategoryDetailEntity> CategoryDetails { get; set; } = null!;
        public DbSet<ProductEntity> Products { get; set; } = null!;
        public DbSet<ProductDetailEntity> ProductDetails { get; set; } = null!;
        public DbSet<ProductReviewEntity> ProductReviews { get; set; } = null!;
        public DbSet<ReviewMedia> ReviewMedias { get; set; } = null!;
        public DbSet<OrderItemEntity> OrderItems { get; set; } = null!;
        public DbSet<VoucherEntity> Vouchers { get; set; } = null!;
        public DbSet<VoucherUseSaleBillEntity> VoucherUseSaleBills { get; set; } = null!;
        public DbSet<SaleBillEntity> SaleBills { get; set; } = null!;
        public DbSet<AddressDeliveryEntity> AddressDeliveries { get; set; } = null!;
        public DbSet<SaleBillDetailEntity> SaleBillDetails { get; set; } = null!;
        public DbSet<BackBillEntity> BackBills { get; set; } = null!;
        public DbSet<NotifyEntity> Notifies { get; set; } = null!;
        public DbSet<RefreshTokenEntity> RefreshTokens { get; set; } = null!;
        public DbSet<PaymentHistory> PaymentHistories { get; set; } = null!;
        public DbSet<VerifyAccount> VerifyAccounts { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<AccountEntity>(entity =>
                {
                        entity.ToTable("Account");
                        entity.HasKey(e => e.Id);


                });

                modelBuilder.Entity<AddressDeliveryEntity>(entity =>
                {
                        entity.ToTable("AddressDelivery");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Account)
                                .WithMany(p => p.ListAddressDelivery)
                                .HasForeignKey(d => d.created_by)
                                .OnDelete(DeleteBehavior.Restrict);

                });

                modelBuilder.Entity<BoothEntity>(entity =>
                {
                        entity.ToTable("Booth");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                                .WithOne(e => e.Booth)
                                .HasForeignKey<BoothEntity>(e => e.created_by)
                                .IsRequired(false);
                });

                modelBuilder.Entity<VerifyAccount>(entity =>
                {
                        entity.ToTable("VerifyAccount");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                                .WithOne(p => p.VerifyAccount)
                                .HasForeignKey<VerifyAccount>(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);
                });


                modelBuilder.Entity<CategoryEntity>(entity =>
                {
                        entity.ToTable("Category");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Account)
                                .WithMany(p => p.ListCategory)
                                .HasForeignKey(d => d.created_by)
                                .OnDelete(DeleteBehavior.Restrict);
                });

                modelBuilder.Entity<CategoryDetailEntity>(entity =>
                {
                        entity.ToTable("CategoryDetail");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Category)
                                .WithMany(p => p.ListCategoryDetail)
                                .HasForeignKey(d => d.category_id)
                                .OnDelete(DeleteBehavior.NoAction);
                });

                modelBuilder.Entity<ProductEntity>(entity =>
                {
                        entity.ToTable("Product");
                        entity.HasKey(e => e.Id);

                        entity.Property(e => e.created_by).HasColumnName("booth_id");

                        entity.HasOne(d => d.MyBooth)
                                .WithMany(p => p.ListProduct)
                                .HasForeignKey(d => d.created_by);

                        entity.HasOne(d => d.CategoryDetail)
                                .WithMany(p => p.ListProduct)
                                .HasForeignKey(d => d.category_detail_id)
                                .OnDelete(DeleteBehavior.NoAction);
                });

                modelBuilder.Entity<ProductDetailEntity>(entity =>
                {
                        entity.ToTable("ProductDetail");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Product)
                                .WithMany(p => p.ListProductDetail)
                                .HasForeignKey(d => d.product_id);

                });

                modelBuilder.Entity<ProductReviewEntity>(entity =>
                {
                        entity.ToTable("ProductReview");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                                .WithMany(e => e.ListProductReview)
                                .HasForeignKey(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);

                        entity.HasOne(e => e.Product)
                                .WithMany(e => e.ProductReviews)
                                .HasForeignKey(e => e.product_id)
                                .OnDelete(DeleteBehavior.NoAction);
                });

                modelBuilder.Entity<ReviewMedia>(entity =>
                {
                        entity.ToTable("ReviewMedia");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.ProductReview)
                                .WithMany(e => e.ReviewMedias)
                                .HasForeignKey(e => e.review_id)
                                .OnDelete(DeleteBehavior.Cascade);
                });

                modelBuilder.Entity<VoucherEntity>(entity =>
                {
                        entity.ToTable("Voucher");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                                .WithMany(e => e.ListVoucher)
                                .HasForeignKey(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);
                });

                modelBuilder.Entity<OrderItemEntity>(entity =>
                {
                        entity.ToTable("OrderItem");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.MyBooth)
                                .WithMany(e => e.ListOrderItem)
                                .HasForeignKey(e => e.booth_id)
                                .OnDelete(DeleteBehavior.NoAction);
                        entity.Property(e => e.booth_id).HasColumnName("seller_id");

                        entity.HasOne(e => e.Account)
                                .WithMany(e => e.ListOrderItem)
                                .HasForeignKey(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);
                        entity.Property(e => e.created_by).HasColumnName("buyer_id");


                        entity.HasOne(e => e.ProductDetail)
                                .WithMany(e => e.ListOrderItem)
                                .HasForeignKey(e => e.product_detail_id)
                                .OnDelete(DeleteBehavior.NoAction);

                });

                modelBuilder.Entity<VoucherUseSaleBillEntity>(entity =>
                {
                        entity.ToTable("VoucherUseSaleBill");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Voucher)
                                .WithMany(e => e.VoucherUseSaleBills)
                                .HasForeignKey(e => e.voucher_id)
                                .OnDelete(DeleteBehavior.NoAction);

                        entity.HasOne(e => e.SaleBill)
                                .WithMany(e => e.ListVoucherUseSaleBill)
                                .HasForeignKey(e => e.bill_id);
                });

                modelBuilder.Entity<SaleBillEntity>(entity =>
                {
                        entity.ToTable("SaleBill");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.MyBooth)
                                .WithMany(e => e.ListSaleBill)
                                .HasForeignKey(e => e.booth_id)
                                .OnDelete(DeleteBehavior.NoAction);
                        entity.Property(e => e.booth_id).HasColumnName("seller_id");

                        entity.HasOne(e => e.Account)
                                .WithMany(e => e.ListSaleBill)
                                .HasForeignKey(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);
                        entity.Property(e => e.created_by).HasColumnName("buyer_id");

                        entity.HasOne(e => e.AddressDelivery)
                                .WithMany(e => e.ListSaleBill)
                                .HasForeignKey(e => e.address_delivery_id)
                                .IsRequired(false);

                });

                modelBuilder.Entity<SaleBillDetailEntity>(entity =>
                {
                        entity.ToTable("SaleBillDetail");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.SaleBill)
                                .WithMany(e => e.ListSaleBillDetail)
                                .HasForeignKey(e => e.sale_bill_id);

                        entity.HasOne(e => e.ProductDetail)
                                .WithMany(e => e.SaleBillDetails)
                                .HasForeignKey(e => e.product_detail_id)
                                .OnDelete(DeleteBehavior.NoAction);
                });

                modelBuilder.Entity<BackBillEntity>(entity =>
                {
                        entity.ToTable("BackBill");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.SaleBill)
                                       .WithOne(e => e.BackBill)
                                        .HasForeignKey<BackBillEntity>(e => e.bill_id)
                                        .OnDelete(DeleteBehavior.Cascade);

                        entity.HasOne(e => e.Buyer)
                                        .WithMany(e => e.ListBackBill)
                                        .HasForeignKey(e => e.created_by)
                                        .OnDelete(DeleteBehavior.Restrict);
                        entity.Property(e => e.created_by).HasColumnName("buyer_id");

                        entity.HasOne(e => e.Booth)
                                        .WithMany(e => e.ListBackBill)
                                        .HasForeignKey(e => e.booth_id)
                                        .OnDelete(DeleteBehavior.NoAction);
                });


                modelBuilder.Entity<RefreshTokenEntity>(entity =>
                {
                        entity.ToTable("RefreshToken");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                                .WithOne(e => e.RefreshToken)
                                .HasForeignKey<RefreshTokenEntity>(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);
                });

                modelBuilder.Entity<NotifyEntity>(entity =>
                {
                        entity.ToTable("Notify");
                        entity.HasKey(e => e.Id);

                        // Configure the sender relationship
                        entity.Property(e => e.created_by).HasColumnName("sender_id");
                        entity.HasOne(e => e.NotifySender)
                                .WithMany(e => e.ListNotifySender)
                                .HasForeignKey(e => e.created_by)
                                .HasConstraintName("FK_Notify_Account_Sender")
                                .OnDelete(DeleteBehavior.Restrict);

                        // Configure the receiver relationship
                        entity.Property(e => e.receiver_id).HasColumnName("receiver_id");
                        entity.HasOne(e => e.NotifyReceiver)
                                .WithMany(e => e.ListNotifyReceiver)
                                .HasForeignKey(e => e.receiver_id)
                                .HasConstraintName("FK_Notify_Account_Receiver")
                                .OnDelete(DeleteBehavior.Restrict);
                });

                modelBuilder.Entity<PaymentHistory>(entity =>
                {
                        entity.ToTable("PaymentHistory");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                                .WithMany(e => e.ListPaymentHistory)
                                .HasForeignKey(e => e.created_by)
                                .OnDelete(DeleteBehavior.Restrict);

                        entity.Property(e => e.amount).HasColumnType("decimal(18,2)");
                });

        }
}