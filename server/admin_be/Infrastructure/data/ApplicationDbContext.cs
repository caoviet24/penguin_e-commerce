using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{

        private readonly IConfiguration _configuration;
        public ApplicationDbContext() { }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) : base(options)
        {
                _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
                base.OnConfiguring(optionsBuilder);

                // optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));

                optionsBuilder.UseSqlServer("Server=localhost,1433;Database=penguin;User Id=sa;Password=Test@123;Encrypt=False;TrustServerCertificate=True;");
        }

        public DbSet<UserEntity> Users { get; set; } = null!;
        public DbSet<ProductEntity> Products { get; set; } = null!;
        public DbSet<ProductDetailEntity> ProductDetails { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<AccountEntity>(entity =>
                {
                        entity.ToTable("Account");
                        entity.HasKey(e => e.Id);
                });

                modelBuilder.Entity<UserEntity>(entity =>
                {
                        entity.ToTable("User");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Account)
                        .WithOne(p => p.User)
                        .HasForeignKey<UserEntity>(d => d.created_by);
                });

                modelBuilder.Entity<MyBoothEntity>(entity =>
                {
                        entity.ToTable("MyBooth");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                           .WithOne(e => e.MyBooth)
                           .HasForeignKey<MyBoothEntity>(e => e.created_by);
                });

                modelBuilder.Entity<VerifyAccount>(entity =>
                {
                        entity.ToTable("VerifyAccount");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                        .WithOne(p => p.VerifyAccount)
                        .HasForeignKey<VerifyAccount>(d => d.created_by);
                });


                modelBuilder.Entity<CategoryEntity>(entity =>
                {
                        entity.ToTable("Category");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Account)
                        .WithMany(p => p.ListCategory)
                        .HasForeignKey(d => d.created_by);
                });

                modelBuilder.Entity<CategoryDetailEntity>(entity =>
                {
                        entity.ToTable("CategoryDetail");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(d => d.Category)
                        .WithMany(p => p.ListCategoryDetail)
                        .HasForeignKey(d => d.category_id);
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
                        .HasForeignKey(e => e.created_by);

                        entity.HasOne(e => e.ProductDetail)
                        .WithMany(e => e.ProductReviews)
                        .HasForeignKey(e => e.product_detail_id)
                        .OnDelete(DeleteBehavior.NoAction);
                });

                modelBuilder.Entity<VoucherEntity>(entity =>
                {
                        entity.ToTable("Voucher");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                        .WithMany(e => e.ListVoucher)
                        .HasForeignKey(e => e.created_by);
                });

                modelBuilder.Entity<OrderItemEntity>(entity =>
                {
                        entity.ToTable("OrderItem");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.MyBooth)
                        .WithMany(e => e.ListOrderItem)
                        .HasForeignKey(e => e.boot_id)
                        .OnDelete(DeleteBehavior.NoAction);
                        entity.Property(e => e.boot_id).HasColumnName("seller_id");

                        entity.HasOne(e => e.Account)
                        .WithMany(e => e.ListOrderItem)
                        .HasForeignKey(e => e.created_by);
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

                        entity.Property(e => e.status_bill).HasColumnType("int");

                        entity.HasOne(e => e.MyBooth)
                         .WithMany(e => e.ListSaleBill)
                         .HasForeignKey(e => e.boot_id)
                         .OnDelete(DeleteBehavior.NoAction);
                        entity.Property(e => e.boot_id).HasColumnName("seller_id");

                        entity.HasOne(e => e.Account)
                        .WithMany(e => e.ListSaleBill)
                        .HasForeignKey(e => e.created_by);
                        entity.Property(e => e.created_by).HasColumnName("buyer_id");
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

                modelBuilder.Entity<RefreshTokenEntity>(entity =>
                {
                        entity.ToTable("RefreshToken");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                        .WithOne(e => e.RefreshToken)
                        .HasForeignKey<RefreshTokenEntity>(e => e.created_by);
                });

                modelBuilder.Entity<NotifyEntity>(entity =>
                {
                        entity.ToTable("Notify");
                        entity.HasKey(e => e.Id);

                        entity.HasOne(e => e.Account)
                        .WithMany(e => e.ListNotify)
                        .HasForeignKey(e => e.receiver_id);

                });

        }
}