using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using MediatR;
using WebApi.DBHelper;

namespace Application.MyBooth .Queries.GetBoothById
{
    public class GetBoothByIdQuery : IRequest<BoothDto>
    {
        public string booth_id { get; set; } = null!;
    }
    public class GetBoothByIdHandler(IDbHelper dbHelper) : IRequestHandler<GetBoothByIdQuery, BoothDto>
    {
        public async Task<BoothDto> Handle(GetBoothByIdQuery request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<BoothDto>
            (
                "sp_get_booth_by_id",
                new
                {
                    booth_id = request.booth_id
                }
            );

            return data;
        }
    }
}