using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using MediatR;
using WebApi.DBHelper;

namespace Application.Account.Commands.Update
{
    public class UpdateAccountCommand : IRequest<AccountDto>
    {
        public string Id { get; set; } = null!;
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
        public string role { get; set; } = null!;
        public bool is_banned { get; set; } = false;
    }
    public class UpdateAccountHandler(IDbHelper dbHelper) : IRequestHandler<UpdateAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<AccountDto>(
                "sp_update_account_by_id",
                new
                {
                    acc_id = request.Id,
                    username = request.username,
                    password = request.password,
                    role = request.role,
                    is_banned = request.is_banned,
                    updated_at = DateTime.UtcNow
                }
            );

            return data;
        }
    }
}