using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Enums.status;
using Microsoft.EntityFrameworkCore;

namespace Application.Statistical.Admin
{
    public class GetOverViewAdmin : IRequest<OverViewDto>
    {

    }
    
    public class GetOverViewAdminHandler(IApplicationDbContext context) : IRequestHandler<GetOverViewAdmin, OverViewDto>
    {
        public async Task<OverViewDto> Handle(GetOverViewAdmin request, CancellationToken cancellationToken)
        {
            // Count vouchers by status
            var voucherCountActive = await context.Vouchers
                .Where(v => v.status == (int)StatusVoucher.ACTIVE && !v.is_deleted)
                .CountAsync(cancellationToken);
                
            var voucherCountInactive = await context.Vouchers
                .Where(v => v.status == (int)StatusVoucher.INACTIVE && !v.is_deleted)
                .CountAsync(cancellationToken);
                
            var voucherCountDeleted = await context.Vouchers
                .Where(v => v.is_deleted)
                .CountAsync(cancellationToken);

            // Count products by status
            var productCountActive = await context.Products
                .Where(p => p.is_active && !p.is_deleted)
                .CountAsync(cancellationToken);
                
            var productCountInactive = await context.Products
                .Where(p => !p.is_active && !p.is_deleted)
                .CountAsync(cancellationToken);
                
            var productCountDeleted = await context.Products
                .Where(p => p.is_deleted)
                .CountAsync(cancellationToken);
                
            var productCountUnavailable = await context.Products
                .Where(p => p.status == "UNAVAILABLE" && !p.is_deleted)
                .CountAsync(cancellationToken);

            // Count booths by status
            var boothCountActive = await context.Booths
                .Where(b => b.is_active && !b.is_deleted)
                .CountAsync(cancellationToken);
                
            var boothCountInactive = await context.Booths
                .Where(b => !b.is_active && !b.is_deleted)
                .CountAsync(cancellationToken);
                
            var boothCountDeleted = await context.Booths
                .Where(b => b.is_deleted)
                .CountAsync(cancellationToken);
                
            var boothCountPending = await context.Booths
                .Where(b => b.is_closed && !b.is_deleted)
                .CountAsync(cancellationToken);
                
            var boothCountBanned = await context.Booths
                .Where(b => b.is_banned && !b.is_deleted)
                .CountAsync(cancellationToken);

            // Count accounts by status
            var accountCount = await context.Accounts
                .Where(a => !a.is_deleted)
                .CountAsync(cancellationToken);
                
            var accountCountBanned = await context.Accounts
                .Where(a => a.is_banned && !a.is_deleted)
                .CountAsync(cancellationToken);
                
            var accountCountActive = await context.Accounts
                .Where(a => !a.is_banned && !a.is_deleted)
                .CountAsync(cancellationToken);
                
            var accountCountDeleted = await context.Accounts
                .Where(a => a.is_deleted)
                .CountAsync(cancellationToken);

            // Count categories by status
            var categoryCountActive = await context.Categories
                .Where(c => !c.is_deleted)
                .CountAsync(cancellationToken);
                
            var categoryCountDeleted = await context.Categories
                .Where(c => c.is_deleted)
                .CountAsync(cancellationToken);

            // Count category details
            var categoryDetailCount = await context.CategoryDetails
                .Where(cd => !cd.is_deleted)
                .CountAsync(cancellationToken);
                
            // Count back bills (all back bills without status filtering)
            var totalBackBills = await context.BackBills
                .Where(bb => !bb.is_deleted)
                .CountAsync(cancellationToken);
                
            var totalBackBillsDeleted = await context.BackBills
                .Where(bb => bb.is_deleted)
                .CountAsync(cancellationToken);

            var result = new OverViewDto
            {
                // Voucher counts
                voucher_count_active = voucherCountActive,
                voucher_count_inactive = voucherCountInactive,
                voucher_count_deleted = voucherCountDeleted,
                
                // Product counts
                product_count_active = productCountActive,
                product_count_inactive = productCountInactive,
                product_count_deleted = productCountDeleted,
                product_count_unavailable = productCountUnavailable,
                
                // Booth counts
                booth_count_active = boothCountActive,
                booth_count_inactive = boothCountInactive,
                booth_count_deleted = boothCountDeleted,
                booth_count_pending = boothCountPending,
                booth_count_banned = boothCountBanned,
                
                // Account counts
                account_count = accountCount,
                account_count_banned = accountCountBanned,
                account_count_active = accountCountActive,
                account_count_deleted = accountCountDeleted,
                
                // Category counts
                category_count_active = categoryCountActive,
                category_count_deleted = categoryCountDeleted,
                category_detail_count = categoryDetailCount
            };

            return result;
        }
    }
}