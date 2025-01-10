using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Dtos.Account;
using Dapper;
using MediatR;

namespace Application.Account.Queries.GetListAccount
{
    public class GetListAccountPaginationQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
    public class GetListAccountPaginationHandler(IDbConnection dbConnection) : IRequestHandler<GetListAccountPaginationQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetListAccountPaginationQuery request, CancellationToken cancellationToken)
        {
            var accData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_accounts_pagination",
                new
                {
                    page_number = request.page_number,
                    page_size = request.page_size
                },
                commandType: CommandType.StoredProcedure
            );

            var data = accData.Read<AccountDto>().ToList();
            var total = accData.Read<int>().FirstOrDefault();
         

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