using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Dtos.ResponData;
using Dapper;
using MediatR;

namespace Application.MyBooth .Queries.GetBoothByName
{
    public class GetBoothByNamePaginationQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string booth_name { get; set; } = null!;
    }
    public class GetBoothByNamePaginationHandler(IDbConnection dbConnection) : IRequestHandler<GetBoothByNamePaginationQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetBoothByNamePaginationQuery request, CancellationToken cancellationToken)
        {
            var data = await dbConnection.QueryMultipleAsync
            (
                "sp_get_booth_by_name_pagination",
                new
                {
                    booth_name = request.booth_name,
                    page_number = request.page_number,
                    page_size = request.page_size
                },
                commandType: CommandType.StoredProcedure
            );

            return new ResponDataDto
            {
                total_record = data.Read<int>().FirstOrDefault(),
                page_number = request.page_number,
                page_size = request.page_size,
                data = data.Read<BoothDto>().ToList()
            };

        }
    }
}