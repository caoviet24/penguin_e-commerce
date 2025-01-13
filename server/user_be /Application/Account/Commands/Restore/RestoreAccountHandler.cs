using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using Dapper;
using MediatR;

namespace Application.Account.Commands.Restore
{
    public class RestoreAccountCommand : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class RestoreAccountHandler(IDbConnection dbConnection) : IRequestHandler<RestoreAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(RestoreAccountCommand request, CancellationToken cancellationToken)
        {
            var data = await dbConnection.QueryFirstOrDefaultAsync<AccountDto>(
                "sp_restore_account_by_id",
                new
                {
                    Id = request.acc_id,
                }
            );

            return data;
        }
    }
}