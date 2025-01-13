using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos.ResponData;
using Application.Dtos.Account;
using Dapper;
using MediatR;

namespace Application.Account.Queries.GetAccountsDeleted
{
    public class GetAccountsDeletedQuery : IRequest<ResponDataDto>
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
    public class GetAccountsDeletedHandler(IDbConnection dbConnection) : IRequestHandler<GetAccountsDeletedQuery, ResponDataDto>
    {
        public async Task<ResponDataDto> Handle(GetAccountsDeletedQuery request, CancellationToken cancellationToken)
        {
            var accData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_accounts_deleted_pagination",
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