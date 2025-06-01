using System.Security.Claims;
using Server.Entities;

namespace Server.Services
{
    public interface ITokenService
    {
        string GenerateToken(Student student);
        string GenerateToken(Provider provider);
        string GenerateToken(Admin admin);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string GenerateTokenInternal(int id, string email, string fullName, string roleName);
    }
}