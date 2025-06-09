using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Server.Services;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
       public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmailService _emailService;
    private readonly IPasswordHasher<Student> _studentPasswordHasher;
    private readonly IPasswordHasher<Provider> _providerPasswordHasher;
    private readonly IPasswordHasher<Admin> _adminPasswordHasher;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        AppDbContext context,
         ICurrentUserService currentUserService,
        IPasswordHasher<Student> studentPasswordHasher,
        IPasswordHasher<Provider> providerPasswordHasher,
        IPasswordHasher<Admin> adminPasswordHasher,
        ITokenService tokenService,
        IEmailService emailService,

        IRefreshTokenService refreshTokenService,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _context = context;
         _currentUserService = currentUserService;
        _studentPasswordHasher = studentPasswordHasher;
        _providerPasswordHasher = providerPasswordHasher;
        _adminPasswordHasher = adminPasswordHasher;
        _tokenService = tokenService;
        _emailService = emailService;
        _refreshTokenService = refreshTokenService;
        _configuration = configuration;
        _logger = logger;
    }
        [HttpPost("register/student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }


                if (dto.Password != dto.ConfirmPassword)
                {
                    return BadRequest(new { message = "Passwords do not match" });
                }


                if (await _context.Student.AnyAsync(s => s.Email == dto.Email) ||
                    await _context.Provider.AnyAsync(p => p.Email == dto.Email) ||
                    await _context.Admin.AnyAsync(a => a.Email == dto.Email))
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                var studentRole = await _context.Role.FirstOrDefaultAsync(r => r.Emri == "Student");
                if (studentRole == null)
                {
                    return BadRequest(new { message = "Student role not found" });
                }

                var studentLevelExists = await _context.StudentLevel.AnyAsync(sl => sl.Id == dto.StudentLevelId);
                if (!studentLevelExists)
                {
                    return BadRequest(new { message = "Invalid student level" });
                }

                var student = new Student
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    RoleId = studentRole.Id,
                    SchoolOrUniversityName = dto.SchoolOrUniversityName,
                    StudyField = dto.StudyField,
                    StudentLevelId = dto.StudentLevelId
                };


                student.PasswordHash = _studentPasswordHasher.HashPassword(student, dto.Password);
                _context.Student.Add(student);
                await _context.SaveChangesAsync();

                var token = _tokenService.GenerateToken(student);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        Id = student.Id,
                        FullName = student.FullName,
                        Email = student.Email,
                        PhoneNumber = student.PhoneNumber,
                        Role = studentRole.Emri
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex}");
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }
        [HttpPost("register/provider")]
        public async Task<IActionResult> RegisterProvider([FromBody] RegisterProviderDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (dto.Password != dto.ConfirmPassword)
                {
                    return BadRequest(new { message = "Fjalëkalimet nuk përputhen" });
                }

                if (await _context.Student.AnyAsync(s => s.Email == dto.Email) ||
                    await _context.Provider.AnyAsync(p => p.Email == dto.Email) ||
                    await _context.Admin.AnyAsync(a => a.Email == dto.Email))
                {
                    return BadRequest(new { message = "Ky email ekziston tashmë" });
                }

                var providerRole = await _context.Role.FirstOrDefaultAsync(r => r.Emri == "Provider");
                if (providerRole == null)
                {
                    return BadRequest(new { message = "Roli 'Provider' nuk u gjet" });
                }

                var provider = new Provider
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    RoleId = providerRole.Id,
                    Description = dto.Description,
                    OrganizationName = dto.OrganizationName,
                    IsApproved = false
                };

                provider.PasswordHash = _providerPasswordHasher.HashPassword(provider, dto.Password);

                _context.Provider.Add(provider);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Regjistrimi u krye me sukses. Ju lutem prisni për aprovim nga admini."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gabim në regjistrim: {ex}");
                return StatusCode(500, new { error = "Gabim i brendshëm", message = ex.Message });
            }
        }
      [HttpPost("change-password")]
[Authorize]
public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
{
    try
    {
        var userId = _currentUserService.UserId;
        var role = _currentUserService.Role;

        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        if (dto.NewPassword != dto.ConfirmNewPassword)
        {
            return BadRequest(new { message = "New passwords do not match" });
        }

        if (role == "Student")
        {
            var student = await _context.Student.FindAsync(userId);
            if (student == null)
                return BadRequest(new { message = "User not found" });

         if (string.IsNullOrEmpty(student.PasswordHash))
{
    return BadRequest(new { message = "User has no password set" });
}
            var result = _studentPasswordHasher.VerifyHashedPassword(student, student.PasswordHash, dto.CurrentPassword);
            if (result != PasswordVerificationResult.Success)
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

           
            student.PasswordHash = _studentPasswordHasher.HashPassword(student, dto.NewPassword);
            await _context.SaveChangesAsync();
        }
        else if (role == "Provider")
        {
            
            var provider = await _context.Provider.FindAsync(userId);
            if (provider == null)
                return BadRequest(new { message = "User not found" });

         if (string.IsNullOrEmpty(provider.PasswordHash))
{
    return BadRequest(new { message = "User has no password set" });
}
            var result = _providerPasswordHasher.VerifyHashedPassword(provider, provider.PasswordHash, dto.CurrentPassword);
            
            if (result != PasswordVerificationResult.Success)
                    {
                        return BadRequest(new { message = "Current password is incorrect" });
                    }

          
            provider.PasswordHash = _providerPasswordHasher.HashPassword(provider, dto.NewPassword);
            await _context.SaveChangesAsync();
        }
        else
        {
            return BadRequest(new { message = "Invalid user role" });
        }

        return Ok(new { message = "Password changed successfully" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error changing password");
        return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
    }
}

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
    public string ConfirmNewPassword { get; set; } = null!;
}[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    try
    {

        if (!string.IsNullOrEmpty(dto.Role))
        {
 
            if (dto.Role.Equals("Student", StringComparison.OrdinalIgnoreCase))
            {
                var student = await _context.Student.Include(s => s.Role).FirstOrDefaultAsync(s => s.Email == dto.Email);
                if (student == null)
                {
                    return Unauthorized(new { message = "Invalid email or password for Student role" });
                }

                if (string.IsNullOrEmpty(student.PasswordHash))
                    return Unauthorized(new { message = "Invalid email or password" });

                var result = _studentPasswordHasher.VerifyHashedPassword(student, student.PasswordHash!, dto.Password);
                if (result == PasswordVerificationResult.Success)
                {
                    var token = _tokenService.GenerateToken(student);
                    var refreshToken = _tokenService.GenerateRefreshToken();
                    _refreshTokenService.StoreRefreshToken(refreshToken, student.Id, student.Role.Emri);

                    return Ok(new
                    {
                        token,
                        refreshToken,
                        expiresIn = 15 * 60,
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
                return Unauthorized(new { message = "Invalid password for Student role" });
            }
          
            else if (dto.Role.Equals("Provider", StringComparison.OrdinalIgnoreCase))
            {
                var provider = await _context.Provider.Include(p => p.Role).FirstOrDefaultAsync(p => p.Email == dto.Email);
                if (provider == null)
                {
                    return Unauthorized(new { message = "Invalid email or password for Provider role" });
                }

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
                    var refreshToken = _tokenService.GenerateRefreshToken();
                    _refreshTokenService.StoreRefreshToken(refreshToken, provider.Id, provider.Role.Emri);

                    return Ok(new
                    {
                        token,
                        refreshToken,
                        expiresIn = 15 * 60,
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
                return Unauthorized(new { message = "Invalid password for Provider role" });
            }
     
            else if (dto.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                var admin = await _context.Admin
                    .Include(a => a.Role)
                    .FirstOrDefaultAsync(a => a.Email == dto.Email && a.IsApproved == true);
                
                if (admin == null)
                {
                    return Unauthorized(new { message = "Invalid email or password for Admin role" });
                }

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
                    var refreshToken = _tokenService.GenerateRefreshToken();
                    _refreshTokenService.StoreRefreshToken(refreshToken, admin.Id, admin.Role.Emri);

                    return Ok(new
                    {
                        token,
                        refreshToken,
                        expiresIn = 15 * 60,
                        user = new AdminDto
                        {
                            Id = admin.Id,
                            FullName = admin.FullName,
                            Email = admin.Email,
                        }
                    });
                }
                return Unauthorized(new { message = "Invalid password for Admin role" });
            }
        }

        
        return BadRequest(new { message = "Role must be specified" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Login error: {ex}");
        return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
    }
}
        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshTokenDto dto)
        {
            try
            {
                var principal = _tokenService.GetPrincipalFromExpiredToken(dto.Token);
                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = principal.FindFirst(ClaimTypes.Role);

                if (userIdClaim == null || roleClaim == null)
                    return Unauthorized(new { message = "Invalid token claims" });

                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return Unauthorized(new { message = "Invalid user ID in token" });

                var role = roleClaim.Value;

                if (!_refreshTokenService.ValidateRefreshToken(dto.RefreshToken, userId, role))
                    return Unauthorized(new { message = "Invalid refresh token" });

                _refreshTokenService.RemoveRefreshToken(dto.RefreshToken);

                var emailClaim = principal.FindFirst(JwtRegisteredClaimNames.Email);
                var fullNameClaim = principal.FindFirst("FullName");

                if (emailClaim == null || fullNameClaim == null)
                    return Unauthorized(new { message = "Invalid token claims" });

                var newToken = _tokenService.GenerateTokenInternal(
                    userId,
                    emailClaim.Value,
                    fullNameClaim.Value,
                    role);

                var newRefreshToken = _tokenService.GenerateRefreshToken();
                _refreshTokenService.StoreRefreshToken(newRefreshToken, userId, role);

                return Ok(new
                {
                    token = newToken,
                    refreshToken = newRefreshToken,
                    expiresIn = 15 * 60
                });
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }
        [HttpPost("revoke")]
        public IActionResult Revoke([FromBody] RefreshTokenDto dto)
        {
            try
            {
                _refreshTokenService.RemoveRefreshToken(dto.RefreshToken);
                return Ok(new { message = "Token revoked successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }
         [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        try
        {
            var student = await _context.Student.FirstOrDefaultAsync(s => s.Email == dto.Email);
            var provider = await _context.Provider.FirstOrDefaultAsync(p => p.Email == dto.Email);
            var admin = await _context.Admin.FirstOrDefaultAsync(a => a.Email == dto.Email);

            var user = student as object ?? provider as object ?? admin as object;
            if (user == null)
            {
                return Ok(new { message = "If your email exists, you will receive a password reset link" });
            }

            string resetToken;
            string userId;

            if (user is Student s)
            {
                resetToken = _tokenService.GeneratePasswordResetToken(s.Id, s.Email, "Student");
                userId = s.Id.ToString();
            }
            else if (user is Provider p)
            {
                resetToken = _tokenService.GeneratePasswordResetToken(p.Id, p.Email, "Provider");
                userId = p.Id.ToString();
            }
            else if (user is Admin a)
            {
                resetToken = _tokenService.GeneratePasswordResetToken(a.Id, a.Email, "Admin");
                userId = a.Id.ToString();
            }
            else
            {
                return BadRequest(new { message = "Invalid user type" });
            }

            var frontendUrl = _configuration["Frontend:BaseUrl"] ?? "https://localhost:3000";
            var resetLink = $"{frontendUrl}/reset-password?token={resetToken}";

            var emailSubject = "Password Reset Request";
            var emailBody = $@"
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Please click the link below to reset your password:</p>
                <p><a href='{resetLink}'>{resetLink}</a></p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            ";

            await _emailService.SendEmailAsync(dto.Email, emailSubject, emailBody);

            return Ok(new { 
                message = "If your email exists, you will receive a password reset link shortly."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Forgot password error");
            return StatusCode(500, new { 
                message = "Failed to send reset link. Please try again later."
            });
        }
    }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            try
            {
                var principal = _tokenService.ValidatePasswordResetToken(dto.ResetToken);
                if (principal == null)
                {
                    return BadRequest(new { message = "Invalid or expired token" });
                }

                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = principal.FindFirst(ClaimTypes.Role);

                if (userIdClaim == null || roleClaim == null ||
                    !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest(new { message = "Invalid token claims" });
                }

                if (dto.NewPassword != dto.ConfirmPassword)
                {
                    return BadRequest(new { message = "Passwords do not match" });
                }

                var role = roleClaim.Value;

                if (role == "Student")
                {
                    var student = await _context.Student.FindAsync(userId);
                    if (student == null)
                        return BadRequest(new { message = "User not found" });

                    student.PasswordHash = _studentPasswordHasher.HashPassword(student, dto.NewPassword);
                    await _context.SaveChangesAsync();
                }
                else if (role == "Provider")
                {
                    var provider = await _context.Provider.FindAsync(userId);
                    if (provider == null)
                        return BadRequest(new { message = "User not found" });

                    provider.PasswordHash = _providerPasswordHasher.HashPassword(provider, dto.NewPassword);
                    await _context.SaveChangesAsync();
                }
                else if (role == "Admin")
                {
                    var admin = await _context.Admin.FindAsync(userId);
                    if (admin == null)
                        return BadRequest(new { message = "User not found" });

                    admin.PasswordHash = _adminPasswordHasher.HashPassword(admin, dto.NewPassword);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    return BadRequest(new { message = "Invalid user role" });
                }

                return Ok(new { message = "Password has been reset successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            try
            {

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = User.FindFirst(ClaimTypes.Role);


                if (userIdClaim == null || roleClaim == null)
                {
                    return BadRequest(new { message = "Invalid token claims" });
                }


                if (!int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest(new { message = "Invalid user ID in token" });
                }

                var role = roleClaim.Value;


                var authHeader = Request.Headers["Authorization"].ToString();
                var token = string.IsNullOrEmpty(authHeader)
                    ? string.Empty
                    : authHeader.Replace("Bearer ", "");


                if (!string.IsNullOrEmpty(token))
                {
                    _refreshTokenService.RemoveRefreshToken(token);
                }

                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }
    }
  

    public class RefreshTokenDto
    {
        public string Token { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }
}