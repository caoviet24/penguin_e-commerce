using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Application.Dtos;
using Application.Dtos.Account;
using BCrypt.Net;
using Dapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Identities.Commands.SignIn
{
    public class CreateSignInCommand : IRequest<TokenDto>
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
    }
    public class CreateSignInHandler(IApplicationDbContext context, ITokenData tokenData, IMapper mapper) : IRequestHandler<CreateSignInCommand, TokenDto>
    {
        public async Task<TokenDto> Handle(CreateSignInCommand request, CancellationToken cancellationToken)
        {
            var account = await context.Accounts.FirstOrDefaultAsync(a => a.username == request.username, cancellationToken);
            var accountDto = mapper.Map<AccountDto>(account);
            if (account?.Id == null)
            {
                throw new NotFoundException("Username is not exist.");
            }

            var isMathPassword = BCrypt.Net.BCrypt.Verify(request.password, account.password);
            if (!isMathPassword)
            {
                throw new BadRequestException("Password is incorrect.");
            }

            var checkRefreshToken = await tokenData.findTokenByUserId(account.Id);
            if (checkRefreshToken != null)
            {
                var token = await tokenData.updateToken(checkRefreshToken, accountDto);
                return token;
            }
            else
            {
                var newToken = await tokenData.createTokenAndSaveToken(accountDto);
                return newToken;
            }

        }
    }
}