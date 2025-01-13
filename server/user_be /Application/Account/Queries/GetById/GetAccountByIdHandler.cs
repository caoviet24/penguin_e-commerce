using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.Account;
using MediatR;
using WebApi.DBHelper;

namespace Application.Account.Queries.GetById
{
    public class GetAccountByIdQuery : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class GetAccountByIdHandler(IDbHelper dbHelper) : IRequestHandler<GetAccountByIdQuery, AccountDto>
    {
        public async Task<AccountDto> Handle(GetAccountByIdQuery request, CancellationToken cancellationToken)
        {
            var data = await dbHelper.QueryProceduceSingleDataAsync<AccountDto>
            (
                "sp_get_account_by_id",
                new
                {
                    Id = request.acc_id
                }
            );
            return data;

        }
    }

}