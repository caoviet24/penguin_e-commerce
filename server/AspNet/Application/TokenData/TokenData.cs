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
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.TokenData
{
    public class TokenData(IApplicationDbContext context, IMapper mapper, IJwtService jwtService) : ITokenData
    {
        public async Task<TokenDto> createTokenAndSaveToken(AccountDto account)
        {
            var accessToken = jwtService.generateAccessToken(account);
            var refreshToken = jwtService.generateRefreshToken(account);


            await context.RefreshTokens.AddAsync(
                new RefreshTokenEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    refresh_token = refreshToken,
                    is_deleted = false,
                    created_at = DateTime.UtcNow,
                    created_by = account.Id,
                    last_updated = DateTime.UtcNow,
                    updated_by = account.Id
                }, cancellationToken: default);
            

            return new TokenDto()
            {
                access_token = accessToken,
                refresh_token = refreshToken
            };
        }

        public async Task<RefreshTokenDto> findRefreshToken(string refresh_token)
        {
            var refreshTokenData = await context.RefreshTokens
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.refresh_token == refresh_token && !rt.is_deleted);
            return mapper.Map<RefreshTokenDto>(refreshTokenData);
        }

        public async Task<RefreshTokenDto> findTokenByUserId(string userId)
        {
            var refreshTokenData = await context.RefreshTokens
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.created_by == userId && !rt.is_deleted);
            return mapper.Map<RefreshTokenDto>(refreshTokenData);
        }

        public async Task<TokenDto> updateToken(RefreshTokenDto refreshTokenDto, AccountDto account)
        {
            var accessToken = jwtService.generateAccessToken(account);
            var refreshToken = jwtService.generateRefreshToken(account);

            var refreshTokenEntity = mapper.Map<RefreshTokenEntity>(refreshTokenDto);
            refreshTokenEntity.refresh_token = refreshToken;

            context.RefreshTokens.Update(refreshTokenEntity);
            await context.SaveChangesAsync(cancellationToken: default);


            return new TokenDto()
            {
                access_token = accessToken,
                refresh_token = refreshToken
            };
        }
    }
}