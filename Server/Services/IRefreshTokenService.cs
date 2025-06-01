using System.Collections.Concurrent;

namespace Server.Services
{
     public interface IRefreshTokenService
    {
        void StoreRefreshToken(string refreshToken, int userId, string role);
        bool ValidateRefreshToken(string refreshToken, int userId, string role);
        void RemoveRefreshToken(string refreshToken);
    }

   
}