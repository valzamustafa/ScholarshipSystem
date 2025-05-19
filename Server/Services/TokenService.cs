using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Server.Entities;

namespace Server.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(Student student)
        {
            return GenerateTokenInternal(student.Id, student.Email, student.FullName, student.Role?.Emri ?? "Student");
        }

        public string GenerateToken(Provider provider)
        {
            return GenerateTokenInternal(provider.Id, provider.Email, provider.FullName, provider.Role?.Emri ?? "Provider");
        }

        public string GenerateToken(Admin admin)
        {
            return GenerateTokenInternal(admin.Id, admin.Email, admin.FullName, admin.Role?.Emri ?? "Admin");
        }

        private string GenerateTokenInternal(int id, string email, string fullName, string roleName)
        {
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new InvalidOperationException("JWT key is missing or empty in configuration.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),  
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, roleName),
                new Claim("FullName", fullName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
