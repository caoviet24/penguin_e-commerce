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

namespace Application.TokenData
{
    public class TokenData(IDbConnection dbConnection, IJwtService jwtService) : ITokenData
    {
        public async Task<TokenDto> createTokenAndSaveToken(AccountDto account)
        {
            var accessToken = jwtService.generateAccessToken(account);
            var refreshToken = jwtService.generateRefreshToken(account);


            await dbConnection.ExecuteAsync
             (
                 "sp_create_refresh_token",
                 new
                 {
                     Id = Guid.NewGuid().ToString(),
                     token = refreshToken,
                     created_at = DateTime.UtcNow,
                     created_by = account.Id,
                     last_updated = DateTime.UtcNow,
                     updated_by = account.Id,
                     is_deleted = false
                 },
                 commandType: CommandType.StoredProcedure
             );
             
            return new TokenDto()
            {
                access_token = accessToken,
                refresh_token = refreshToken
            };
        }

        public async Task<RefreshTokenDto> findRefreshToken(string refresh_token)
        {
            var refreshTokenData = await dbConnection.QueryFirstOrDefaultAsync<RefreshTokenDto>
            (
                "sp_get_by_refresh_token",
                new
                {
                    token = refresh_token
                },
                commandType: CommandType.StoredProcedure
            );

            return refreshTokenData;
        }

        public async Task<RefreshTokenDto> findTokenByUserId(string userId)
        {
            var tokenData = await dbConnection.QueryFirstOrDefaultAsync<RefreshTokenDto>
           (
               "sp_get_refresh_token_by_acc_id",
               new
               {
                   acc_id = userId
               },
               commandType: CommandType.StoredProcedure
           );

            return tokenData;
        }

        public async Task<TokenDto> updateToken(RefreshTokenDto refreshTokenDto, AccountDto account)
        {
            var accessToken = jwtService.generateAccessToken(account);
            var refreshToken = jwtService.generateRefreshToken(account);

            await dbConnection.ExecuteAsync
            (
                "sp_update_refresh_token",
                new
                {
                    token = refreshToken,
                    created_at = DateTime.UtcNow,
                    created_by = refreshTokenDto.created_by,
                    last_updated = DateTime.UtcNow,
                    updated_by = refreshTokenDto.updated_by,
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