using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class CreateSignInHandler(IDbHelper dbHelper, IJwtService jwtService) : IRequestHandler<CreateSignInCommand, TokenDto>
    {
        public async Task<TokenDto> Handle(CreateSignInCommand request, CancellationToken cancellationToken)
        {
            var account = await dbHelper.QueryProceduceSingleDataAsync<AccountEntity>
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

            return new TokenDto
            {
                accessToken = jwtService.generateAccessToken(account),
                refreshToken = jwtService.generateRefreshToken(account)
            };
        }
    }
}