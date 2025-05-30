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
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, id.ToString()),  
        new Claim(JwtRegisteredClaimNames.Email, email),
        new Claim(ClaimTypes.Role, roleName),
        new Claim("FullName", fullName)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this_is_a_very_long_secret_key_with_more_than_32_chars_1234"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: "your_app_name",
        audience: "your_app_users",
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(60),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }
}
