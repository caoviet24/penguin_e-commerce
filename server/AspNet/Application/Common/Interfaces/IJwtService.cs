

using Application.Dtos.Account;
using Domain.Entities;

namespace Application.Common.Interfaces
{
    public interface IJwtService
    {
        string generateAccessToken(AccountDto ccount);
        string generateRefreshToken(AccountDto account);

    }
}