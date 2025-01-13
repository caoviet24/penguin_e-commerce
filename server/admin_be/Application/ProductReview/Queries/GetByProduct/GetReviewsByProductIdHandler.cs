using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Dapper;
using MediatR;

namespace Application.ProductReview.Queries.GetByProduct
{
    public class GetReviewsByProductIdQuery : IRequest<List<ProductReviewDto>>
    {
        public string product_id { get; set; } = null!;
    }
    public class GetReviewsByProductIdHandler(IDbConnection dbConnection) : IRequestHandler<GetReviewsByProductIdQuery, List<ProductReviewDto>>
    {
        public async Task<List<ProductReviewDto>> Handle(GetReviewsByProductIdQuery request, CancellationToken cancellationToken)
        {
            var data = await dbConnection.QueryMultipleAsync
            (
                "sp_get_reviews_by_product_id",
                new
                {
                    Id = request.product_id
                },
                commandType: CommandType.StoredProcedure
            );

            Dictionary<string, ProductReviewDto> prReviewDic = new Dictionary<string, ProductReviewDto>();
            data.Read<UserDto, ProductReviewDto, ProductDetailDto, ProductReviewDto>
            (
                (user, pr, pd) =>
                {
                    if(user.user_id != null)
                    {
                        pr.user = user;
                    }

                    if(!prReviewDic.TryGetValue(pr.Id, out var prEntry))
                    {
                        prEntry = pr;
                        prReviewDic.Add(prEntry.Id, prEntry);
                    }

                    if(pd.Id != null)
                    {
                        pr.product_detail = pd;
                    }

                    return pr;
                },
                splitOn: "created_by, created_at"
            ).ToList();

            return prReviewDic.Values.ToList();
        }
    }
}