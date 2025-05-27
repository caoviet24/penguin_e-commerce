using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Common.Interfaces;
using Application.Dtos;
using Application.Dtos.Account;
using Application.Identities;
using Dapper;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Auth
{
    public class AuthService(IUser user, IApplicationDbContext context, ITokenData tokenData, IMapper mapper) : IAuthService
    {
        public async Task<AccountDto> authMe()
        {
            string Id = user.getCurrentUser();
            if (Id == null)
            {
                throw new BadRequestException("User is not logged in.");
            }
            var account = await context.Accounts.FindAsync(Id);
            if (account == null)
            {
                throw new NotFoundException("Account not found.");
            }
            var accountDto = mapper.Map<AccountDto>(account);
            return accountDto;
        }

        public async Task<TokenDto> refreshToken(string refresh_token)
        {
            if (refresh_token == null)
            {
                throw new BadRequestException("Refresh token is required.");
            }

            var checkRefreshToken = await tokenData.findRefreshToken(refresh_token);
            if (checkRefreshToken == null)
            {
                throw new NotFoundException("Refresh token is not exist.");
            }

            var account = await context.Accounts.FirstOrDefaultAsync(x => x.Id == checkRefreshToken.created_by);
            var accountDto = mapper.Map<AccountDto>(account);
            var newToken = await tokenData.updateToken(checkRefreshToken, accountDto);
            return newToken;
        }
    }
}