using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Server.Services;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<Student> _studentPasswordHasher;
        private readonly IPasswordHasher<Provider> _providerPasswordHasher;
        private readonly IPasswordHasher<Admin> _adminPasswordHasher;
        private readonly ITokenService _tokenService;

        public AuthController(
            AppDbContext context,
            IPasswordHasher<Student> studentPasswordHasher,
            IPasswordHasher<Provider> providerPasswordHasher,
            IPasswordHasher<Admin> adminPasswordHasher,
            ITokenService tokenService)
        {
            _context = context;
            _studentPasswordHasher = studentPasswordHasher;
            _providerPasswordHasher = providerPasswordHasher;
            _adminPasswordHasher = adminPasswordHasher;
            _tokenService = tokenService;
        }

        [HttpPost("register/student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new { message = "Model validation failed", errors });
                }

                bool emailExists = await _context.Student.AnyAsync(s => s.Email == dto.Email)
                    || await _context.Provider.AnyAsync(p => p.Email == dto.Email);

                if (emailExists)
                    return BadRequest(new { message = "Email already exists" });

                var levelExists = await _context.StudentLevel.AnyAsync(sl => sl.Id == dto.StudentLevelId);
                if (!levelExists)
                    return BadRequest(new { message = "Invalid student level" });

                var studentRole = await _context.Role.FirstOrDefaultAsync(r => r.Emri == "Student");
                if (studentRole == null)
                    return BadRequest(new { message = "Student role not found" });

                var student = new Student
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    PasswordHash = _studentPasswordHasher.HashPassword(null!, dto.Password),
                    SchoolOrUniversityName = dto.SchoolOrUniversityName,
                    StudyField = dto.StudyField,
                    RoleId = studentRole.Id,
                    StudentLevelId = dto.StudentLevelId
                };

                _context.Student.Add(student);
                await _context.SaveChangesAsync();

                var token = _tokenService.GenerateToken(student);

                return Ok(new
                {
                    token,
                    user = new UserResponseDto
                    {
                        Id = student.Id,
                        FullName = student.FullName,
                        Email = student.Email,
                        PhoneNumber = student.PhoneNumber,
                        Role = new RoleDto
                        {
                            Id = studentRole.Id,
                            Emri = studentRole.Emri
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                var innerMessages = "";
                var inner = ex.InnerException;
                while (inner != null)
                {
                    innerMessages += inner.Message + " | ";
                    inner = inner.InnerException;
                }

                return StatusCode(500, new
                {
                    error = "Internal Server Error",
                    message = ex.Message,
                    innerExceptionMessages = innerMessages
                });
            }
        }

        [HttpPost("register/provider")]
        public async Task<IActionResult> RegisterProvider([FromBody] RegisterProviderDto dto)
        {
            try
            {
                bool emailExists = await _context.Student.AnyAsync(s => s.Email == dto.Email)
                    || await _context.Provider.AnyAsync(p => p.Email == dto.Email);

                if (emailExists)
                    return BadRequest(new { message = "Email already exists" });

                var providerRole = await _context.Role.FirstOrDefaultAsync(r => r.Emri == "Provider");
                if (providerRole == null)
                    return BadRequest(new { message = "Provider role not found" });

               var provider = new Provider
{
    FullName = dto.FullName,
    Email = dto.Email,
    PhoneNumber = dto.PhoneNumber,
    OrganizationName = dto.OrganizationName,
    RoleId = providerRole.Id,
    IsApproved = false 
};


provider.PasswordHash = _providerPasswordHasher.HashPassword(provider, dto.Password);

_context.Provider.Add(provider);
await _context.SaveChangesAsync();


                return Ok(new { message = "Provider registered successfully. Waiting for admin approval." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Internal Server Error",
                    message = ex.Message
                });
            }
        }

       [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    try
    {
        var student = await _context.Student.Include(s => s.Role).FirstOrDefaultAsync(s => s.Email == dto.Email);
        if (student != null)
        {
            if (string.IsNullOrEmpty(student.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var result = _studentPasswordHasher.VerifyHashedPassword(student, student.PasswordHash!, dto.Password);
            if (result == PasswordVerificationResult.Success)
            {
                var token = _tokenService.GenerateToken(student);
                return Ok(new
                {
                    token,
                    user = new UserResponseDto
                    {
                        Id = student.Id,
                        FullName = student.FullName,
                        Email = student.Email,
                        PhoneNumber = student.PhoneNumber,
                        Role = new RoleDto { Id = student.Role.Id, Emri = student.Role.Emri }
                    }
                });
            }
            return Unauthorized(new { message = "Invalid password" });
        }

        var provider = await _context.Provider.Include(p => p.Role).FirstOrDefaultAsync(p => p.Email == dto.Email);
        if (provider != null)
        {
            if (string.IsNullOrEmpty(provider.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var result = PasswordVerificationResult.Failed;
            try
            {
                result = _providerPasswordHasher.VerifyHashedPassword(provider, provider.PasswordHash!, dto.Password);
            }
            catch (FormatException)
            {
            
                return Unauthorized(new { message = "Invalid password format" });
            }

            if (result == PasswordVerificationResult.Success)
            {
                if (!provider.IsApproved)
                    return Unauthorized(new { message = "Your account is pending approval by the admin." });

                var token = _tokenService.GenerateToken(provider);
                return Ok(new
                {
                    token,
                    user = new UserResponseDto
                    {
                        Id = provider.Id,
                        FullName = provider.FullName,
                        Email = provider.Email,
                        PhoneNumber = provider.PhoneNumber,
                        Role = new RoleDto { Id = provider.Role.Id, Emri = provider.Role.Emri }
                    }
                });
            }
            return Unauthorized(new { message = "Invalid password" });
        }

        var admin = await _context.Admin
            .Include(a => a.Role)
            .FirstOrDefaultAsync(a => a.Email == dto.Email && a.IsApproved == true);

        if (admin != null)
        {
            if (string.IsNullOrEmpty(admin.PasswordHash))
            {
                return Unauthorized(new { message = "Admin account not properly configured" });
            }

            var result = PasswordVerificationResult.Failed;
            try
            {
                result = _adminPasswordHasher.VerifyHashedPassword(admin, admin.PasswordHash, dto.Password);
            }
            catch (FormatException)
            {
                return Unauthorized(new { message = "Invalid password format" });
            }

            if (result == PasswordVerificationResult.Success)
            {
                var token = _tokenService.GenerateToken(admin);
                return Ok(new
                {
                    token,
                    user = new AdminDto
                    {
                        Id = admin.Id,
                        FullName = admin.FullName,
                        Email = admin.Email,
                    }
                });
            }
            return Unauthorized(new { message = "Invalid password" });
        }

        return Unauthorized(new { message = "Invalid email or password" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Login error: {ex}");
        return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
    }
}
   }
}
