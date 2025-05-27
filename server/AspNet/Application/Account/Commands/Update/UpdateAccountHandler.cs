using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Dtos.Account;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;


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
    public class UpdateAccountHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdateAccountCommand, AccountDto>
    {
        public async Task<AccountDto> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            var findAccount = await context.Accounts.FindAsync(request.Id);
            if (findAccount == null)
            {
                throw new NotFoundException("Account not found");
            }

            var updateAccount = mapper.Map<AccountEntity>(request);

            var result = context.Accounts.Update(updateAccount);
            var account = mapper.Map<AccountDto>(result.Entity);
            return account;
        }
    }
}