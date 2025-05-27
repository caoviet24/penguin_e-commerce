using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Dapper;
using Domain.Exceptions;
using MediatR;

namespace Application.Account.Commands.Restore
{
    public class RestoreAccountCommand : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class RestoreAccountHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<RestoreAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(RestoreAccountCommand request, CancellationToken cancellationToken)
        {
            var findAccount = await context.Accounts.FindAsync(request.acc_id);
            if (findAccount == null)
            {
                throw new NotFoundException("Account not found");
            }

            findAccount.is_deleted = false;

            var result = context.Accounts.Update(findAccount);
            await context.SaveChangesAsync(cancellationToken);
            var account = mapper.Map<AccountDto>(result.Entity);
            return account;
        }
    }
}