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
using WebApi.DBHelper;


namespace Application.Identities.Commands.SignIn
{
    public class CreateSignInCommand : IRequest<TokenDto>
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
    }
    public class CreateSignInHandler(IDbHelper dbHelper, ITokenData tokenData) : IRequestHandler<CreateSignInCommand, TokenDto>
    {
        public async Task<TokenDto> Handle(CreateSignInCommand request, CancellationToken cancellationToken)
        {
            var account = await dbHelper.QueryProceduceSingleDataAsync<AccountDto>
            (
                "sp_get_account_by_username",
                new
                {
                    username = request.username
                }
            );

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
                var token = await tokenData.updateToken(checkRefreshToken, account);
                return token;
            }
            else
            {
                var newToken = await tokenData.createTokenAndSaveToken(account);
                return newToken;
            }

        }
    }
}