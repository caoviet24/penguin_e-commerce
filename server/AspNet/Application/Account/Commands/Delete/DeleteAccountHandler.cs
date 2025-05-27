using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Domain.Exceptions;
using MediatR;


namespace Application.Account.Commands.Delete
{
    public class DeleteAccountCommand : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class DeleteAccountHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<DeleteAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
        {
            var findAccount = await context.Accounts.FindAsync(request.acc_id);
            if (findAccount == null)
            {
                throw new NotFoundException("Account not found");
            }

            findAccount.is_deleted = true;

            var result = context.Accounts.Update(findAccount);
            await context.SaveChangesAsync(cancellationToken);
            var account = mapper.Map<AccountDto>(result.Entity);
            return account;

        }
    }
}