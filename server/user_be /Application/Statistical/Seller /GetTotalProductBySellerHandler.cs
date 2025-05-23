using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using MediatR;

namespace Application.Statistical.Seller 
{

     public class GetTotalProductBySellerQuery : IRequest<object>
    {
        public string seller_id { get; set; } = null!;
    }
    public class GetTotalProductBySellerHandler(IDbConnection dbConnection) : IRequestHandler<GetTotalProductBySellerQuery, object>
    {
        public async Task<object> Handle(GetTotalProductBySellerQuery request, CancellationToken cancellationToken)
        {
             var data = await dbConnection.QueryMultipleAsync
            (
                "sp_get_total_product_by_seller_id",
                new
                {
                    seller_id = request.seller_id,
                },
                commandType: CommandType.StoredProcedure
            );

            return new {
                active = data.Read<int>().FirstOrDefault(),
                inactive = data.Read<int>().FirstOrDefault()
            };
        }
    }
}