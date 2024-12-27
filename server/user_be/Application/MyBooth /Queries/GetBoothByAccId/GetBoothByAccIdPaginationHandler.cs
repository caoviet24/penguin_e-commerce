using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.MyBooth.Queries.GetBoothByAccId
{
    public class GetBoothByAccIdPaginationQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string account_id { get; set; } = null!;
    }
    public class GetBoothByAccIdPaginationHandler(IDbConnection dbConnection) : IRequestHandler<GetBoothByAccIdPaginationQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetBoothByAccIdPaginationQuery request, CancellationToken cancellationToken)
        {
            var boothData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_booth_by_acc_id",
                new
                {
                    account_id = request.account_id,
                    page_number = request.page_number,
                    page_size = request.page_size
                },
                commandType: CommandType.StoredProcedure
            );

            return new ResponDataDto
            {
                total_record = boothData.Read<int>().FirstOrDefault(),
                page_number = request.page_number,
                page_size = request.page_size,
                data = boothData.Read<BoothDto>().ToList()
            };
            
            
        }
    }
}