using Server.Data;
using Server.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;
using Server.Services;



internal class Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

       
        builder.Services.AddControllers();

  
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Scholarship API",
                Version = "v1"
            });
        });

       
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

       
        builder.Services.AddScoped<IPasswordHasher<Student>, PasswordHasher<Student>>();
        builder.Services.AddScoped<IPasswordHasher<Provider>, PasswordHasher<Provider>>();
        builder.Services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();
        builder.Services.AddScoped<AuthService>();

      
        builder.Services.AddScoped<ITokenService, TokenService>();

      
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                policy =>
                {
                    policy.WithOrigins("https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
        });

        var app = builder.Build();

    
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            
          
            var context = services.GetRequiredService<AppDbContext>();
            await context.Database.MigrateAsync();

           
            var adminPasswordHasher = services.GetRequiredService<IPasswordHasher<Admin>>();
            await DbInitializer.SeedAdminAsync(context, adminPasswordHasher);
        }

        
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Scholarship API v1");
            });
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowFrontend");
        app.UseAuthorization();
        app.MapControllers();

        await app.RunAsync();
    }
}