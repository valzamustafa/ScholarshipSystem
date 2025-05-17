using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Server.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<Admin> _passwordHasher;

        public AuthService(AppDbContext context, IPasswordHasher<Admin> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

      
        public async Task<bool> ValidateAdminLoginAsync(string email, string password)
{
    var admin = await _context.Admin.FirstOrDefaultAsync(a => a.Email == email);
    if (admin == null)
        return false;

 
    if (string.IsNullOrEmpty(admin.PasswordHash))
        return false;

    var result = _passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, password);

    return result == PasswordVerificationResult.Success;
}

   
        public async Task CreateAdminAsync(Admin admin, string password)
        {
            admin.PasswordHash = _passwordHasher.HashPassword(admin, password);
            _context.Admin.Add(admin);
            await _context.SaveChangesAsync();
        }
    }
}
