using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Domain.Exceptions;
using MediatR;


namespace Application.Account.Queries.GetById
{
    public class GetAccountByIdQuery : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class GetAccountByIdHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetAccountByIdQuery, AccountDto>
    {
        public async Task<AccountDto> Handle(GetAccountByIdQuery request, CancellationToken cancellationToken)
        {
            var findAccount = await context.Accounts.FindAsync(request.acc_id);
            if (findAccount == null)
            {
                throw new NotFoundException("Account not found");
            }

            var account = mapper.Map<AccountDto>(findAccount);
            return account;

        }
    }

}