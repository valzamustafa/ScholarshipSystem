using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Server.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

        public int? UserId
        {
            get
            {
                var idClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return int.TryParse(idClaim, out var userId) ? userId : (int?)null;
            }
        }

        public string Email => User?.FindFirstValue(ClaimTypes.Email) ?? string.Empty;

        public string Role => User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
    }
}
