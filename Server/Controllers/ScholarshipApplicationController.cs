using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScholarshipApplicationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScholarshipApplicationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("byscholarship/{scholarshipId}")]
        public async Task<ActionResult<IEnumerable<ScholarshipApplicationDto>>> GetByScholarship(int scholarshipId)
        {
            var applications = await _context.Application
                .Include(a => a.Student)
                .Include(a => a.Scholarship)
                .Include(a => a.ApplicationStatus)
                .Where(a => a.ScholarshipId == scholarshipId)
                .Select(a => new ScholarshipApplicationDto
                {
                    Id = a.Id,
                    ScholarshipTitle = a.Scholarship.Title,
                    StudentName = a.Student.FullName,
                    StudentEmail = a.Student.Email,
                     StudentPhone=a.Student.PhoneNumber,
                    Status = a.ApplicationStatus.StatusName
                })
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPut("updatestatus/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] int newStatusId)
        {
            var application = await _context.Application
                .Include(a => a.Student)
                .Include(a => a.Scholarship)
                    .ThenInclude(s => s.Provider) 
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
                return NotFound();

            application.ApplicationStatusId = newStatusId;
            await _context.SaveChangesAsync();

            var status = await _context.ApplicationStatus.FindAsync(newStatusId);
            if (status?.StatusName == "Approved")
            {
                var alreadyAwarded = await _context.ScholarshipAward
                    .AnyAsync(a => a.ScholarshipId == application.ScholarshipId && a.StudentId == application.StudentId);

                if (!alreadyAwarded)
                {
                    _context.ScholarshipAward.Add(new ScholarshipAward
                    {
                        StudentId = application.StudentId,
                        ScholarshipId = application.ScholarshipId,
                        AwardDate = DateTime.UtcNow,
                       
                    });

                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }
    }
}
