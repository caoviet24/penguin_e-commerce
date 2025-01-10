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
using Application.Interface;
using Dapper;
using Domain.Exceptions;
using WebApi.DBHelper;

namespace Application.Auth
{
    public class AuthService(IUser user, IJwtService tokenService, IDbConnection dbConnection) : IAuthService
    {
        public async Task<AccountDto> authMe()
        {
            string Id = user.getCurrentUser();
            var accountData = await dbConnection.QueryMultipleAsync
            (
                "sp_get_account_by_id",
                new
                {
                    Id = Id
                },
                commandType: CommandType.StoredProcedure
            );


            Dictionary<string, AccountDto> accDic = new Dictionary<string, AccountDto>();

            accountData.Read<AccountDto, UserDto, AccountDto>
            (
                (acc, user) =>
                {
                    if (!accDic.TryGetValue(acc.Id, out var accEntry))
                    {
                        accEntry = acc;
                        accDic.Add(accEntry.Id, accEntry);
                    }

                    if(user.acc_id != null)
                    {
                        accEntry.User = user;
                    }

                    return accEntry;
                },
                splitOn: "user_id"
            );

        
            return accDic.Values.First();
        }

        public async Task<TokenDto> refreshToken(string refresh_token)
        {
            if (refresh_token == null)
            {
                throw new BadRequestException("Refresh token is required.");
            }

            var refreshTokenData = await dbConnection.QueryFirstOrDefaultAsync<RefreshTokenDto>
            (
                "sp_get_by_refresh_token",
                new
                {
                    token = refresh_token
                },
                commandType: CommandType.StoredProcedure
            );

            if (refreshTokenData == null)
            {
                throw new NotFoundException("Refresh token is not found.");
            }


            var accountData = await dbConnection.QueryFirstOrDefaultAsync<AccountDto>
            (
                "sp_get_account_by_id",
                new
                {
                    Id = refreshTokenData.created_by
                },
                commandType: CommandType.StoredProcedure
            );

            if (accountData == null)
            {
                throw new NotFoundException("Account is not found.");
            }
            
            var accessToken = tokenService.generateAccessToken(accountData);
            var refreshToken = tokenService.generateRefreshToken(accountData);

            await dbConnection.ExecuteAsync
            (
                "sp_update_refresh_token",
                new
                {
                    token = refreshToken,
                    created_at = DateTime.UtcNow,
                    created_by = refreshTokenData.created_by,
                    last_updated = DateTime.UtcNow,
                    updated_by = refreshTokenData.updated_by,
                },
                commandType: CommandType.StoredProcedure
            );

            return new TokenDto()
            {
                access_token = accessToken,
                refresh_token = refreshToken
            };

        }
    }
}