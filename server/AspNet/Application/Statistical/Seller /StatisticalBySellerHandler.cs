using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.Statistical.Seller
{
    public class StatisticalBySellerQuery : IRequest<List<StatisticalDto>>
    {
        public string seller_id { get; set; } = null!;
        public string mode { get; set; } = null!;
    }
    public class StatisticalBySellerHandler(IDbConnection dbConnection) : IRequestHandler<StatisticalBySellerQuery, List<StatisticalDto>>
    {
        public async Task<List<StatisticalDto>> Handle(StatisticalBySellerQuery request, CancellationToken cancellationToken)
        {
            var data = await dbConnection.QueryMultipleAsync
            (
                "sp_get_statistical_by_seller_id",
                new
                {
                    seller_id = request.seller_id,
                    mode = request.mode
                },
                commandType: CommandType.StoredProcedure
            );

            var statistical = data.Read<StatisticalDto>().ToList();
            return statistical;

            
        }
    }
}