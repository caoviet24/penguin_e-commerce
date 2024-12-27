

using Domain.Entities;

namespace Application.Identities
{
    public interface IJwtService
    {
        string generateAccessToken(AccountEntity account);
        string generateRefreshToken(AccountEntity account);

    }
}