using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Dtos;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == "id");
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var now = DateTime.UtcNow;
            var thirtyDaysAgo = now.AddDays(-30);

            var totalStudents = await _context.Student.CountAsync();
            var totalProviders = await _context.Provider.CountAsync();
            var totalScholarships = await _context.Scholarship.CountAsync();
            var totalApplications = await _context.Application.CountAsync();

            var newStudents = await _context.Student.Where(s => s.CreatedAt >= thirtyDaysAgo).CountAsync();
            var newProviders = await _context.Provider.Where(p => p.CreatedAt >= thirtyDaysAgo).CountAsync();
            var newScholarships = await _context.Scholarship.Where(s => s.CreatedAt >= thirtyDaysAgo).CountAsync();
            var newApplications = await _context.Application.Where(a => a.CreatedAt >= thirtyDaysAgo).CountAsync();

            return Ok(new {
                TotalStudents = totalStudents,
                TotalProviders = totalProviders,
                TotalScholarships = totalScholarships,
                TotalApplications = totalApplications,
                NewStudents = newStudents,
                NewProviders = newProviders,
                NewScholarships = newScholarships,
                NewApplications = newApplications
            });
        }

        [HttpGet("provider-requests")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetPendingProviderRequests()
        {
            return Ok(await _context.Provider.Where(p => !p.IsApproved).ToListAsync());
        }

        [HttpPut("provider/{id}/approve")]
        public async Task<IActionResult> ApproveProvider(int id)
        {
            var provider = await _context.Provider.FindAsync(id);
            if (provider == null) return NotFound();

            provider.IsApproved = true;
            provider.ApprovedAt = DateTime.UtcNow;

            _context.AuditLog.Add(new AuditLog
            {
                Action = "Approved Provider",
                Details = $"{provider.FullName} from {provider.OrganizationName}",
                ActionDate = DateTime.UtcNow,
                Timestamp = DateTime.UtcNow,
                UserId = GetCurrentUserId()
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("providers")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetAllProviders()
        {
            return Ok(await _context.Provider.ToListAsync());
        }

        [HttpGet("students")]
        public async Task<ActionResult<IEnumerable<Student>>> GetAllStudents()
        {
            return Ok(await _context.Student.ToListAsync());
        }

        [HttpPut("students/{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto dto)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return NotFound();

            student.SchoolOrUniversityName = dto.SchoolOrUniversityName;
            student.StudyField = dto.StudyField;
            student.StudentLevelId = dto.StudentLevelId;

            _context.AuditLog.Add(new AuditLog
            {
                Action = "Updated Student",
                Details = $"Student: {student.FullName}",
                ActionDate = DateTime.UtcNow,
                Timestamp = DateTime.UtcNow,
                UserId = GetCurrentUserId()
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }
  [HttpGet("users/admins")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllAdmins()
        {
            var studentAdmins = await _context.Student
                .Where(s => s.RoleId == 3) 
                .Select(s => new 
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Email = s.Email,
                    Type = "Student"
                })
                .ToListAsync();

            var providerAdmins = await _context.Provider
                .Where(p => p.RoleId == 3) 
                .Select(p => new 
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    Email = p.Email,
                    Type = "Provider"
                })
                .ToListAsync();

            return Ok(studentAdmins.Concat(providerAdmins));
        }

        [HttpGet("users/search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchUsers([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest("Search term is required");

            var studentResults = await _context.Student
                .Where(s => s.FullName.Contains(term) || s.Email.Contains(term))
                .Select(s => new 
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Email = s.Email,
                    Type = "Student"
                })
                .ToListAsync();

            var providerResults = await _context.Provider
                .Where(p => p.FullName.Contains(term) || p.Email.Contains(term))
                .Select(p => new 
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    Email = p.Email,
                    Type = "Provider"
                })
                .ToListAsync();

            return Ok(studentResults.Concat(providerResults));
        }

[HttpPut("users/{id}/grant-admin")]
public async Task<IActionResult> GrantAdminAccess(int id)
{
    var adminRole = await _context.Role.FirstOrDefaultAsync(r => r.Emri == "Admin");
    if (adminRole == null) return BadRequest("Admin role not found");

    var student = await _context.Student.FindAsync(id);
    if (student != null)
    {
        if (string.IsNullOrWhiteSpace(student.PasswordHash))
            return BadRequest("Student does not have a valid password set");

        student.RoleId = adminRole.Id;

        if (!await _context.Admin.AnyAsync(a => a.Email == student.Email))
        {
            var newAdmin = new Admin
            {
                FullName = student.FullName,
                Email = student.Email,
                RoleId = adminRole.Id,
                IsApproved = true,
                PasswordHash = student.PasswordHash
            };
            _context.Admin.Add(newAdmin);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    var provider = await _context.Provider.FindAsync(id);
    if (provider != null)
    {
        if (string.IsNullOrWhiteSpace(provider.PasswordHash))
            return BadRequest("Provider does not have a valid password set");

        provider.RoleId = adminRole.Id;

        if (!await _context.Admin.AnyAsync(a => a.Email == provider.Email))
        {
            var newAdmin = new Admin
            {
                FullName = provider.FullName,
                Email = provider.Email,
                RoleId = adminRole.Id,
                IsApproved = true,
                PasswordHash = provider.PasswordHash
            };
            _context.Admin.Add(newAdmin);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    return NotFound();
}



       [HttpPut("users/{id}/revoke-admin")]
public async Task<IActionResult> RevokeAdminAccess(int id)
{
    var student = await _context.Student.FindAsync(id);
    if (student != null)
    {
        student.RoleId = 1; 
        var admin = await _context.Admin.FirstOrDefaultAsync(a => a.Email == student.Email);
        if (admin != null)
            _context.Admin.Remove(admin);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    var provider = await _context.Provider.FindAsync(id);
    if (provider != null)
    {
        provider.RoleId = 2; 
        var admin = await _context.Admin.FirstOrDefaultAsync(a => a.Email == provider.Email);
        if (admin != null)
            _context.Admin.Remove(admin);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    return NotFound();
}


        [HttpGet("logs")]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs()
        {
            var logs = await _context.AuditLog
                .Include(l => l.User)
                .OrderByDescending(l => l.Timestamp)
                .Take(100)
                .ToListAsync();

            return Ok(logs);
        }

        [HttpGet("recent-activity")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecentActivity()
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

           var providerApprovals = await _context.Provider
    .Where(p => p.IsApproved && p.ApprovedAt >= thirtyDaysAgo)
    .OrderByDescending(p => p.ApprovedAt)
    .Take(10)
    .Select(p => new AuditLogDto
    {
        Action = "Provider Approved",
        Details = $"{p.FullName} from {p.OrganizationName}",
        Timestamp = p.ApprovedAt ?? DateTime.UtcNow
    })
    .ToListAsync();

var newScholarships = await _context.Scholarship
    .Where(s => s.CreatedAt >= thirtyDaysAgo)
    .OrderByDescending(s => s.CreatedAt)
    .Take(10)
    .Select(s => new AuditLogDto
    {
        Action = "New Scholarship",
        Details = $"{s.Title} by {s.Provider.FullName}",
        Timestamp = s.CreatedAt
    })
    .ToListAsync();

var newApplications = await _context.Application
    .Where(a => a.CreatedAt >= thirtyDaysAgo)
    .OrderByDescending(a => a.CreatedAt)
    .Take(10)
    .Select(a => new AuditLogDto
    {
        Action = "New Application",
        Details = $"{a.Student.FullName} applied for {a.Scholarship.Title}",
        Timestamp = a.CreatedAt
    })
    .ToListAsync();

var all = new List<AuditLogDto>();
all.AddRange(providerApprovals);
all.AddRange(newScholarships);
all.AddRange(newApplications);

var ordered = all.OrderByDescending(a => a.Timestamp).Take(10).ToList();
return Ok(ordered);



           
        }
    }
}
