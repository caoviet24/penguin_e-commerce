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
    public class AuthService(IUser user, IDbConnection dbConnection, ITokenData tokenData) : IAuthService
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

                    if (user.acc_id != null)
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



            var checkRefreshToken = await tokenData.findRefreshToken(refresh_token);
            if (checkRefreshToken == null)
            {
                throw new NotFoundException("Refresh token is not exist.");
            }

            var account = await dbConnection.QueryFirstOrDefaultAsync<AccountDto>
            (
                "sp_get_account_by_id",
                new
                {
                    Id = checkRefreshToken.created_by
                },
                commandType: CommandType.StoredProcedure
            );
            
            var newToken = await tokenData.updateToken(checkRefreshToken, account);
            return newToken;
        }
    }
}