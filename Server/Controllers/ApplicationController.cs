using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationController(AppDbContext context)
        {
            _context = context;
        }
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
        {
            return await _context.Application
                .Include(a => a.Student)
                .Include(a => a.Scholarship)
                .Include(a => a.ApplicationStatus)
                .Include(a => a.ApplicationDocument)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var application = await _context.Application
                .Include(a => a.Student)
                .Include(a => a.Scholarship)
                .Include(a => a.ApplicationStatus)
                .Include(a => a.ApplicationDocument)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }
      [HttpGet("admin")]
public async Task<IActionResult> GetApplicationsForAdmin()
{
    var applications = await _context.Application
        .Include(a => a.Student)
            .ThenInclude(s => s.StudentLevel)
        .Include(a => a.Scholarship)
            .ThenInclude(s => s.Provider)
        .Include(a => a.ApplicationStatus)
        .Include(a => a.ApplicationDocument)
        .Select(a => new
        {
            a.Id,
             Student = a.Student,
            StudentName = a.Student.FullName,
            SchoolOrUniversityName = a.Student.SchoolOrUniversityName,
            StudyField = a.Student.StudyField,
            StudentLevelName = a.Student.StudentLevel.Level,
            ScholarshipTitle = a.Scholarship.Title,
            ProviderName = a.Scholarship.Provider.FullName,
            a.ApplicationDate,
            a.ApplicationStatusId,
            ApplicationDocument = a.ApplicationDocument.Select(d => d.FilePath).ToList()
        })
        .ToListAsync();

    return Ok(applications);
}

        [HttpGet("byprovider/{providerId}")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetByProvider(int providerId)
        {
            var applications = await _context.Application
                .Include(a => a.Scholarship)  
                .Include(a => a.Student)
                .Include(a => a.ApplicationStatus)
                .Where(a => a.Scholarship.ProviderId == providerId)  
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    ApplicationDate = a.ApplicationDate,
                    ApplicationStatusId = a.ApplicationStatusId,
                    ApplicationStatusName = a.ApplicationStatus.StatusName,
                    StudentId = a.StudentId,
                    StudentName = a.Student.FullName,
                    ScholarshipId = a.ScholarshipId,
                    ScholarshipTitle = a.Scholarship.Title
                })
                .ToListAsync();

            return Ok(applications);
        }

        
     [HttpPost]
public async Task<ActionResult<Application>> PostApplication([FromBody] CreateApplicationDto dto)
{
    var application = new Application
    {
        StudentId = dto.StudentId,
        ScholarshipId = dto.ScholarshipId,
        ApplicationStatusId = dto.ApplicationStatusId,
        ApplicationDate = DateTime.UtcNow,
        MotivationLetter = dto.MotivationLetter,
        Gpa = dto.Gpa,
        StudyYear = dto.StudyYear,
        StudyField = dto.StudyField,
        Portfolio = dto.Portfolio,
        CvLink = dto.CvLink,
      ApplicationDocument = dto.ApplicationDocument.Select(doc => new ApplicationDocument
{
    FilePath = doc,
    FileName = System.IO.Path.GetFileName(doc)  
}).ToList()

    };

    _context.Application.Add(application);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
}


        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplication(int id, Application application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            _context.Entry(application).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Application.FindAsync(id);
            if (application == null)
            {
                return NotFound();
            }

            _context.Application.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }

[HttpPut("{id}/status")]
public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateStatusDto statusDto)
{
    var application = await _context.Application.FindAsync(id);
    if (application == null)
    {
        return NotFound();
    }

    var statusExists = await _context.ApplicationStatus.AnyAsync(s => s.Id == statusDto.StatusId);
    if (!statusExists)
    {
        return BadRequest("Invalid status ID");
    }

    application.ApplicationStatusId = statusDto.StatusId;
    await _context.SaveChangesAsync();

    return NoContent();
}

public class UpdateStatusDto
{
    public int StatusId { get; set; }
}
        private bool ApplicationExists(int id)
        {
            return _context.Application.Any(e => e.Id == id);
        }
    }
}
