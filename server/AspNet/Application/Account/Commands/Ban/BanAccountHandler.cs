using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Domain.Exceptions;
using MediatR;

namespace Application.Account.Commands.Ban
{
    public class BanAccountCommand : IRequest<AccountDto>
    {
        public string acc_id { get; set; } = null!;
    }
    public class BanAccountHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<BanAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(BanAccountCommand request, CancellationToken cancellationToken)
        {
            var findAccount = await context.Accounts.FindAsync(request.acc_id);
            if (findAccount == null)
            {
                throw new NotFoundException("Account not found");
            }

            if (findAccount.is_banned)
            {
                throw new BadRequestException("Account is already banned");
            }

            findAccount.is_banned = true;
            var result = context.Accounts.Update(findAccount);
            await context.SaveChangesAsync(cancellationToken);
            var accountDto = mapper.Map<AccountDto>(result.Entity);
            return accountDto;
            
        }
    }
}