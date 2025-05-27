using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.Statistical.Seller 
{
    public class StatisticalTotalBySellerQuery : IRequest<object>
    {
        public string seller_id { get; set; } = null!;
    }
    public class StatisticalTotalBySellerHandler(IDbConnection dbConnection) : IRequestHandler<StatisticalTotalBySellerQuery, object>
    {
        public async Task<object> Handle(StatisticalTotalBySellerQuery request, CancellationToken cancellationToken)
        {
             var data = await dbConnection.QueryMultipleAsync
            (
                "sp_get_total_by_seller_id",
                new
                {
                    seller_id = request.seller_id,
                },
                commandType: CommandType.StoredProcedure
            );
            return new {
                total_active = data.Read<int>().FirstOrDefault(),
                total_inactive = data.Read<int>().FirstOrDefault(),
                total = data.Read<int>().FirstOrDefault(), 
                bills_sold = data.Read<int>().FirstOrDefault(),
            };
        }
    }
}