using System;
using System.Collections.Concurrent;

namespace Server.Services
{
    public class InMemoryRefreshTokenService : IRefreshTokenService
    {
        private readonly ConcurrentDictionary<string, (int userId, string role, DateTime expiry)> _refreshTokens = new();

        public void StoreRefreshToken(string refreshToken, int userId, string role)
        {
            var expiry = DateTime.UtcNow.AddDays(1); 
            _refreshTokens[refreshToken] = (userId, role, expiry);
        }

        public bool ValidateRefreshToken(string refreshToken, int userId, string role)
        {
            if (_refreshTokens.TryGetValue(refreshToken, out var stored))
            {
                return stored.userId == userId &&
                       stored.role == role &&
                       stored.expiry > DateTime.UtcNow;
            }

            return false;
        }

        public void RemoveRefreshToken(string refreshToken)
        {
            _refreshTokens.TryRemove(refreshToken, out _);
        }
    }
}
