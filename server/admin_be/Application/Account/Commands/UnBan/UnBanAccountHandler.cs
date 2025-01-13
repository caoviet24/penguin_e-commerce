using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using MediatR;
using WebApi.DBHelper;

namespace Application.Account.Commands.UnBan
{
    public class UnBanAccountCommand : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class UnBanAccountHandler(IDbHelper db) : IRequestHandler<UnBanAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(UnBanAccountCommand request, CancellationToken cancellationToken)
        {
            var data = await db.QueryProceduceSingleDataAsync<AccountDto>(
                "sp_unban_account_by_id",
                new
                {
                    acc_id = request.acc_id
                }
            );
            return data;
        }
    }
}