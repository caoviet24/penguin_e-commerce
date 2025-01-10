using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using MediatR;
using WebApi.DBHelper;

namespace Application.Account.Commands.Ban
{
    public class BanAccountCommand : IRequest<AccountDto>
    {
        public string Id { get; set; } = null!;
    }
    public class BanAccountHandler(IDbHelper db) : IRequestHandler<BanAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(BanAccountCommand request, CancellationToken cancellationToken)
        {
            var data = await db.QueryProceduceSingleDataAsync<AccountDto>(
                "sp_ban_account_by_id",
                new
                {
                    acc_id = request.Id
                }
            );
            return data;
        }
    }
}