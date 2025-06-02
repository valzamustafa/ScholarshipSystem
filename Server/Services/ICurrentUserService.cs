using System.Security.Claims;

namespace Server.Services
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
        string Email { get; }
        string Role { get; }
        ClaimsPrincipal? User { get; }
    }
}
