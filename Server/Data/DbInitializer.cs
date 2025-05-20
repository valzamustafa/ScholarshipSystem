using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAdminAsync(AppDbContext context, IPasswordHasher<Admin> passwordHasher)
        {
   
            var adminRole = await context.Role.FirstOrDefaultAsync(r => r.Emri == "Admin");
            if (adminRole == null)
            {
                adminRole = new Role { Emri = "Admin" };
                context.Role.Add(adminRole);
                await context.SaveChangesAsync();
            }


           var adminUser = await context.Admin
    .FirstOrDefaultAsync(u => u.Email == "krasniqiana27@gmail.com");


            if (adminUser == null)
            {
                adminUser = new Admin
                {
                    Email = "krasniqiana27@gmail.com",
                    RoleId = adminRole.Id,
                    FullName = "Admin Ana",
                    IsApproved = true
                };

              
                adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "AnaAdmin2025");
                context.Admin.Add(adminUser);


                await context.SaveChangesAsync();
            }
        }
    }
}

