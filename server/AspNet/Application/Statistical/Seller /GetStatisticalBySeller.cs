using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Statistical.Seller 
{
    public class GetStatisticalBySellerQuery : IRequest<List<StatisticalDto>>
    {
        public string seller_id { get; set; } = null!;
        public string period { get; set; } = null!; // "today", "week", "month", "year", "custom"
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
    }

    public class GetStatisticalBySellerHandler(IApplicationDbContext context) : IRequestHandler<GetStatisticalBySellerQuery, List<StatisticalDto>>
    {
        public async Task<List<StatisticalDto>> Handle(GetStatisticalBySellerQuery request, CancellationToken cancellationToken)
        {
            var result = new List<StatisticalDto>();

            switch (request.period.ToLower())
            {
                case "today":
                    result = await GetTodayStatistics(request.seller_id);
                    break;
                case "week":
                    result = await GetWeekStatistics(request.seller_id);
                    break;
                case "month":
                    result = await GetMonthStatistics(request.seller_id);
                    break;
                case "year":
                    result = await GetYearStatistics(request.seller_id);
                    break;
                case "custom":
                    if (request.start_date.HasValue && request.end_date.HasValue)
                    {
                        result = await GetCustomRangeStatistics(request.seller_id, request.start_date.Value, request.end_date.Value);
                    }
                    break;
                default:
                    throw new ArgumentException("Invalid period. Use: today, week, month, year, or custom");
            }

            return result;
        }

        private async Task<List<StatisticalDto>> GetTodayStatistics(string sellerId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var bills = await context.SaleBills
                .Include(b => b.ListSaleBillDetail)
                .Where(b => b.booth_id == sellerId &&
                           b.status == "DELIVERED" &&
                           b.created_at >= today &&
                           b.created_at < tomorrow)
                .ToListAsync();

            var result = new List<StatisticalDto>();

            // Generate 24 hours (0-23)
            for (int hour = 0; hour < 24; hour++)
            {
                var hourStart = today.AddHours(hour);
                var hourEnd = hourStart.AddHours(1);

                var hourBills = bills.Where(b => b.created_at >= hourStart && b.created_at < hourEnd).ToList();
                
                var revenue = hourBills.Sum(b => b.total_bill);
                var productsSold = hourBills.SelectMany(b => b.ListSaleBillDetail).Sum(d => d.quantity);

                result.Add(new StatisticalDto
                {
                    period = $"{hour:00}:00",
                    amount = revenue,
                    product_sold = productsSold
                });
            }

            return result;
        }

        private async Task<List<StatisticalDto>> GetWeekStatistics(string sellerId)
        {
            var today = DateTime.UtcNow.Date;
            var startOfWeek = today.AddDays(-6); // Last 7 days including today

            var bills = await context.SaleBills
                .Include(b => b.ListSaleBillDetail)
                .Where(b => b.booth_id == sellerId &&
                           b.status == "DELIVERED" &&
                           b.created_at >= startOfWeek &&
                           b.created_at < today.AddDays(1))
                .ToListAsync();

            var result = new List<StatisticalDto>();

            // Generate last 7 days
            for (int i = 0; i < 7; i++)
            {
                var date = startOfWeek.AddDays(i);
                var nextDate = date.AddDays(1);

                var dayBills = bills.Where(b => b.created_at >= date && b.created_at < nextDate).ToList();
                
                var revenue = dayBills.Sum(b => b.total_bill);
                var productsSold = dayBills.SelectMany(b => b.ListSaleBillDetail).Sum(d => d.quantity);

                result.Add(new StatisticalDto
                {
                    period = date.ToString("dd/MM/yyyy"),
                    amount = revenue,
                    product_sold = productsSold
                });
            }

            return result;
        }

        private async Task<List<StatisticalDto>> GetMonthStatistics(string sellerId)
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfMonth = startOfMonth.AddMonths(1);

            var bills = await context.SaleBills
                .Include(b => b.ListSaleBillDetail)
                .Where(b => b.booth_id == sellerId &&
                           b.status == "DELIVERED" &&
                           b.created_at >= startOfMonth &&
                           b.created_at < endOfMonth)
                .ToListAsync();

            var result = new List<StatisticalDto>();
            var daysInMonth = DateTime.DaysInMonth(now.Year, now.Month);

            // Generate all days in current month
            for (int day = 1; day <= daysInMonth; day++)
            {
                var date = new DateTime(now.Year, now.Month, day, 0, 0, 0, DateTimeKind.Utc);
                var nextDate = date.AddDays(1);

                var dayBills = bills.Where(b => b.created_at >= date && b.created_at < nextDate).ToList();
                
                var revenue = dayBills.Sum(b => b.total_bill);
                var productsSold = dayBills.SelectMany(b => b.ListSaleBillDetail).Sum(d => d.quantity);

                result.Add(new StatisticalDto
                {
                    period = date.ToString("dd/MM/yyyy"),
                    amount = revenue,
                    product_sold = productsSold
                });
            }

            return result;
        }

        private async Task<List<StatisticalDto>> GetYearStatistics(string sellerId)
        {
            var now = DateTime.UtcNow;
            var startOfYear = new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfYear = startOfYear.AddYears(1);

            var bills = await context.SaleBills
                .Include(b => b.ListSaleBillDetail)
                .Where(b => b.booth_id == sellerId &&
                           b.status == "DELIVERED" &&
                           b.created_at >= startOfYear &&
                           b.created_at < endOfYear)
                .ToListAsync();

            var result = new List<StatisticalDto>();

            // Generate all months in current year
            for (int month = 1; month <= 12; month++)
            {
                var startOfMonth = new DateTime(now.Year, month, 1, 0, 0, 0, DateTimeKind.Utc);
                var endOfMonth = startOfMonth.AddMonths(1);

                var monthBills = bills.Where(b => b.created_at >= startOfMonth && b.created_at < endOfMonth).ToList();
                
                var revenue = monthBills.Sum(b => b.total_bill);
                var productsSold = monthBills.SelectMany(b => b.ListSaleBillDetail).Sum(d => d.quantity);

                result.Add(new StatisticalDto
                {
                    period = startOfMonth.ToString("MM/yyyy"),
                    amount = revenue,
                    product_sold = productsSold
                });
            }

            return result;
        }

        private async Task<List<StatisticalDto>> GetCustomRangeStatistics(string sellerId, DateTime startDate, DateTime endDate)
        {
            // Ensure UTC dates
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1), DateTimeKind.Utc);

            var bills = await context.SaleBills
                .Include(b => b.ListSaleBillDetail)
                .Where(b => b.booth_id == sellerId &&
                           b.status == "DELIVERED" &&
                           b.created_at >= utcStartDate &&
                           b.created_at < utcEndDate)
                .ToListAsync();

            var result = new List<StatisticalDto>();
            var totalMonths = ((endDate.Year - startDate.Year) * 12) + endDate.Month - startDate.Month + 1;

            // Generate statistics by month for the custom range
            var currentDate = new DateTime(startDate.Year, startDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            
            for (int i = 0; i < totalMonths; i++)
            {
                var monthStart = currentDate.AddMonths(i);
                var monthEnd = monthStart.AddMonths(1);

                var monthBills = bills.Where(b => b.created_at >= monthStart && b.created_at < monthEnd).ToList();
                
                var revenue = monthBills.Sum(b => b.total_bill);
                var productsSold = monthBills.SelectMany(b => b.ListSaleBillDetail).Sum(d => d.quantity);

                result.Add(new StatisticalDto
                {
                    period = monthStart.ToString("MM/yyyy"),
                    amount = revenue,
                    product_sold = productsSold
                });
            }

            return result;
        }
    }
}