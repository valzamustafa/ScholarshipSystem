using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalStudents = await _context.Student.CountAsync();
            var totalProviders = await _context.Provider.CountAsync();
            var totalScholarships = await _context.Scholarship.CountAsync();
            var totalApplications = await _context.Application.CountAsync();

            var stats = new
            {
                TotalStudents = totalStudents,
                TotalProviders = totalProviders,
                TotalScholarships = totalScholarships,
                TotalApplications = totalApplications
            };

            return Ok(stats);
        }

        [HttpGet("provider-requests")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetPendingProviderRequests()
        {
            var unapprovedProviders = await _context.Provider
                .Where(p => !p.IsApproved)
                .ToListAsync();

            return Ok(unapprovedProviders);
        }

        [HttpGet("providers")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetAllProviders()
        {
            var providers = await _context.Provider.ToListAsync();
            return Ok(providers);
        }

        [HttpPut("provider/{id}/approve")]
        public async Task<IActionResult> ApproveProvider(int id)
        {
            var provider = await _context.Provider.FindAsync(id);
            if (provider == null)
                return NotFound();

            provider.IsApproved = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("students/{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto updateStudentDto)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return NotFound();

            student.SchoolOrUniversityName = updateStudentDto.SchoolOrUniversityName;
            student.StudyField = updateStudentDto.StudyField;
            student.StudentLevelId = updateStudentDto.StudentLevelId;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        [HttpGet("students")]
        public async Task<ActionResult<IEnumerable<Student>>> GetAllStudents()
        {
            var students = await _context.Student.ToListAsync();
            return Ok(students);
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
           
            var student = await _context.Student.FindAsync(id);
            if (student != null)
            {
                student.RoleId = 3; 
                await _context.SaveChangesAsync();
                return NoContent();
            }

            var provider = await _context.Provider.FindAsync(id);
            if (provider != null)
            {
                provider.RoleId = 3; 
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
                await _context.SaveChangesAsync();
                return NoContent();
            }

           
            var provider = await _context.Provider.FindAsync(id);
            if (provider != null)
            {
                provider.RoleId = 2; 
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return NotFound();
        }
    }
}