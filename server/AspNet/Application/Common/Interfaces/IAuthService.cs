using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Dtos.Account;

namespace Application.Common.Interfaces
{
    public interface IAuthService
    {
        Task<AccountDto> authMe();
        Task<TokenDto> refreshToken(string refresh_token);

    }
}