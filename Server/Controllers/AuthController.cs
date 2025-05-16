using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Server.Services;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<Student> _studentPasswordHasher;
        private readonly IPasswordHasher<Provider> _providerPasswordHasher;
        private readonly ITokenService _tokenService;

        public AuthController(
            AppDbContext context,
            IPasswordHasher<Student> studentPasswordHasher,
            IPasswordHasher<Provider> providerPasswordHasher,
            ITokenService tokenService)
        {
            _context = context;
            _studentPasswordHasher = studentPasswordHasher;
            _providerPasswordHasher = providerPasswordHasher;
            _tokenService = tokenService;
        }
[HttpPost("register/student")]
public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDto dto)
{
    try
    {
        // kod validimi dhe shtimi i studentit
        bool emailExists = await _context.Student.AnyAsync(s => s.Email == dto.Email)
            || await _context.Provider.AnyAsync(p => p.Email == dto.Email);

        if (emailExists)
            return BadRequest("Email already exists");

        var studentRole = await _context.Role.FindAsync(1);
        if (studentRole == null)
            return BadRequest("Student role not found");

       var student = new Student
{
    FullName = dto.FullName,
    Email = dto.Email,
    PhoneNumber = dto.PhoneNumber,
    PasswordHash = _studentPasswordHasher.HashPassword(null!, dto.Password),
    SchoolOrUniversityName = dto.SchoolOrUniversityName,
    StudyField = dto.StudyField,
    RoleId = studentRole.Id,
    StudentLevelId = 1 // vendos një nivel default
};


        _context.Student.Add(student);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Student registered successfully. Waiting for admin approval." });
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
                    return BadRequest("Email already exists");

                var providerRole = await _context.Role.FirstOrDefaultAsync(r => r.Emri == "Provider");
                if (providerRole == null)
                    return BadRequest("Provider role not found");

                var provider = new Provider
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    PasswordHash = _providerPasswordHasher.HashPassword(null!, dto.Password),
                    OrganizationName = dto.OrganizationName,
                    IsLocal = dto.IsLocal,
                    RoleId = providerRole.Id
                };

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
                var student = await _context.Student
                    .Include(s => s.Role)
                    .FirstOrDefaultAsync(s => s.Email == dto.Email);

                if (student != null)
                {
                    var result = _studentPasswordHasher.VerifyHashedPassword(student, student.PasswordHash, dto.Password);
                    if (result == PasswordVerificationResult.Success)
                    {
                        var token = _tokenService.GenerateToken(student);
                        var response = new UserResponseDto
                        {
                            Id = student.Id,
                            FullName = student.FullName,
                            Email = student.Email,
                            PhoneNumber = student.PhoneNumber,
                            Role = student.Role.Emri
                        };
                        return Ok(new { token, user = response });
                    }
                    else
                    {
                        return Unauthorized("Invalid password");
                    }
                }

                var provider = await _context.Provider
                    .Include(p => p.Role)
                    .FirstOrDefaultAsync(p => p.Email == dto.Email);

                if (provider != null)
                {
                    var result = _providerPasswordHasher.VerifyHashedPassword(provider, provider.PasswordHash, dto.Password);
                    if (result == PasswordVerificationResult.Success)
                    {
                        var token = _tokenService.GenerateToken(provider);
                        var response = new UserResponseDto
                        {
                            Id = provider.Id,
                            FullName = provider.FullName,
                            Email = provider.Email,
                            PhoneNumber = provider.PhoneNumber,
                            Role = provider.Role.Emri
                        };
                        return Ok(new { token, user = response });
                    }
                    else
                    {
                        return Unauthorized("Invalid password");
                    }
                }

                return Unauthorized("Invalid email or password");
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
    }
}
