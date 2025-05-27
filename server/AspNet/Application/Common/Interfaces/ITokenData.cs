using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Dtos;
using Application.Dtos;
using Application.Dtos.Account;

namespace Application.Common.Interfaces
{
    public interface ITokenData
    {
        Task<RefreshTokenDto> findTokenByUserId(string userId);
        Task<RefreshTokenDto> findRefreshToken(string refresh_token);
        Task<TokenDto> createTokenAndSaveToken(AccountDto account);
        Task<TokenDto> updateToken(RefreshTokenDto refresh_token, AccountDto account);
    }
}