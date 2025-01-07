

using Application.Dtos.Account;
using Domain.Entities;

namespace Application.Identities
{
    public interface IJwtService
    {
        string generateAccessToken(AccountDto ccount);
        string generateRefreshToken(AccountDto account);

    }
}