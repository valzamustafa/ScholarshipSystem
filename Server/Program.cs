using Server.Data;
using Server.Entities;  
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http.Features;
using Server.Services;

internal class Program
{
    private static void Main(string[] args)
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
       builder.Services.AddScoped<IPasswordHasher<Student>, PasswordHasher<Student>>();
        builder.Services.AddScoped<IPasswordHasher<Provider>, PasswordHasher<Provider>>();
        builder.Services.AddScoped<ITokenService, TokenService>();



        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Scholarship API v1");
            });
        }

        app.UseHttpsRedirection();

        // ✅ Aktivizo CORS këtu
        app.UseCors("AllowFrontend");

        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }
}
