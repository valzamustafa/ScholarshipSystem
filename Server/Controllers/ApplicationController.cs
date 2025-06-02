using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Hosting;
using Server.Services;
namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
 private readonly IWebHostEnvironment _env; 
       public ApplicationController(AppDbContext context, IWebHostEnvironment env, INotificationService notificationService)
{
    _context = context;
    _env = env;
    _notificationService = notificationService;
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
            ProviderId = a.Scholarship.ProviderId,
            a.ApplicationDate,
            a.ApplicationStatusId,
            ApplicationDocument = a.ApplicationDocument
                .Select(d => new {
                    d.FileName,
                    d.FilePath
                }).ToList()
        })
        .ToListAsync();

    return Ok(applications);
}
[HttpGet("byprovider/{providerId}")]
public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetByProvider(int providerId)
{
    var applications = await _context.Application
        .Include(a => a.ApplicationDocument)
        .Include(a => a.Scholarship)
        .Include(a => a.Student)
        .Include(a => a.ApplicationStatus)
        .Where(a => a.Scholarship.ProviderId == providerId)
        .AsNoTracking()
        .Select(a => new ApplicationDto
        {
            Id = a.Id,
            ApplicationDate = a.ApplicationDate,
            ApplicationStatusId = a.ApplicationStatusId,
            ApplicationStatusName = a.ApplicationStatus.StatusName,
            StudentId = a.StudentId,
            StudentName = a.Student.FullName,
            ScholarshipId = a.ScholarshipId,
            ScholarshipTitle = a.Scholarship.Title,
            ApplicationDocument = a.ApplicationDocument
                .Select(d => new ApplicationDocumentDto
                {
                    Id = d.Id,
                    FileName = d.FileName,
                    FilePath = d.FilePath,
                    DocumentType = d.DocumentType
                }).ToList()
        })
        .ToListAsync();

    return Ok(applications);
}
   
[HttpPost]
public async Task<ActionResult<Application>> PostApplication([FromForm] CreateApplicationDto dto)
{
    var application = new Application
    {
        StudentId = dto.StudentId,
        ScholarshipId = dto.ScholarshipId,
        ApplicationStatusId = dto.ApplicationStatusId,
        ApplicationDate = DateTime.UtcNow,
        Gpa = dto.Gpa,
        StudyYear = dto.StudyYear,
        StudyField = dto.StudyField,
        ApplicationDocument = new List<ApplicationDocument>()
    };

    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
    if (!Directory.Exists(uploadsPath))
    {
        Directory.CreateDirectory(uploadsPath);
    }

    if (dto.CvFile != null)
    {
        var cvDoc = await SaveDocument(dto.CvFile, "CV", application.Id);
        application.ApplicationDocument.Add(cvDoc);
    }

    if (dto.MotivationLetterFile != null)
    {
        var mlDoc = await SaveDocument(dto.MotivationLetterFile, "MotivationLetter", application.Id);
        application.ApplicationDocument.Add(mlDoc);
    }

    if (dto.PortfolioFile != null)
    {
        var portfolioDoc = await SaveDocument(dto.PortfolioFile, "Portfolio", application.Id);
        application.ApplicationDocument.Add(portfolioDoc);
    }

    _context.Application.Add(application);
    await _context.SaveChangesAsync();

    await _notificationService.CreateApplicationSubmittedNotification(dto.StudentId, application.Id);

    var scholarship = await _context.Scholarship
        .Include(s => s.Provider)
        .FirstOrDefaultAsync(s => s.Id == dto.ScholarshipId);

    if (scholarship != null)
    {
        if (scholarship.ProviderId.HasValue)
        {
            await _notificationService.CreateNewApplicationNotification(
                scholarship.Provider.Id,
                application.Id
            );
        }

      
        var admins = await _context.Admin.ToListAsync();

        foreach (var admin in admins)
        {
            await _notificationService.CreateNewApplicationNotification(
                admin.Id, 
                application.Id
            );
        }
    }

    return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
}

 private async Task<ApplicationDocument> SaveDocument(IFormFile file, string documentType, int applicationId)
        {
            var uploadsPath = Path.Combine(_env.WebRootPath, "Uploads");
            Directory.CreateDirectory(uploadsPath);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsPath, uniqueFileName);
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return new ApplicationDocument
            {
                FileName = file.FileName,
                FilePath = $"/Uploads/{uniqueFileName}",
                DocumentType = documentType,
                ApplicationId = applicationId
            };
        }


[HttpGet("download/{documentId}")]
public async Task<IActionResult> DownloadDocument(int documentId)
{
    var document = await _context.ApplicationDocument.FindAsync(documentId);
    if (document == null)
    {
        return NotFound();
    }

    var filePath = Path.Combine(Directory.GetCurrentDirectory(), document.FilePath.TrimStart('/'));
    
    if (!System.IO.File.Exists(filePath))
    {
        return NotFound();
    }

    var memory = new MemoryStream();
    using (var stream = new FileStream(filePath, FileMode.Open))
    {
        await stream.CopyToAsync(memory);
    }
    memory.Position = 0;

    return File(memory, "application/octet-stream", document.FileName);
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
    var application = await _context.Application
        .Include(a => a.Scholarship)
        .FirstOrDefaultAsync(a => a.Id == id);
    
    if (application == null) return NotFound();

    application.ApplicationStatusId = statusDto.StatusId;
    await _context.SaveChangesAsync();

    
    switch (statusDto.StatusId)
    {
        case 2: 
            await _notificationService.CreateApplicationAcceptedNotification(application.StudentId, id);
          
            break;
        case 3: 
            await _notificationService.CreateApplicationRejectedNotification(application.StudentId, id);
            break;
        default:
            await _notificationService.CreateApplicationStatusUpdatedNotification(application.StudentId, id);
            break;
    }

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
