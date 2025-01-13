using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using MediatR;
using WebApi.DBHelper;

namespace Application.Account.Commands.Delete
{
    public class DeleteAccountCommand : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class DeleteAccountHandler(IDbHelper db) : IRequestHandler<DeleteAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
        {
            var data = await db.QueryProceduceSingleDataAsync<AccountDto>(
                "sp_delete_account_by_id",
                new
                {
                    acc_id = request.acc_id
                }

            );
            return data;
        }
    }
}