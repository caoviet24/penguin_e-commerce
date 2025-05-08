using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.MyBooth.Queries.GetActiving
{

    public class GetBoothActivingQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
    public class GetBoothActivingHandler(IDbConnection dbConnection) : IRequestHandler<GetBoothActivingQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetBoothActivingQuery request, CancellationToken cancellationToken)
        {
            var boothData = await dbConnection.QueryMultipleAsync
               (
                   "sp_get_booth_activing_pagination",
                   new
                   {
                       page_number = request.page_number,
                       page_size = request.page_size
                   },
                   commandType: CommandType.StoredProcedure
               );

            var data = boothData.Read<BoothDto>().ToList();
            var total = boothData.ReadSingle<int>();

            return new ResponDataDto
            {
                total_record = total,
                page_number = request.page_number,
                page_size = request.page_size,
                data = data
            };
        }
    }
}