using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Hosting; 
using Microsoft.AspNetCore.Http;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScholarshipController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ScholarshipController(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }
        
 [HttpGet("byprovider/{providerId}")]
public async Task<IActionResult> GetByProvider(int providerId)
{
    var scholarships = await _context.Scholarship
        .Where(s => s.ProviderId == providerId)
        .Include(s => s.ScholarshipCategory)
        .Include(s => s.ScholarshipType)
        .Select(s => new {
            s.Id,
            s.Title,
            s.Description,
            s.ApplyLink,
            s.Deadline, 
            s.IsAvailable,
            s.ImageFile,
            ScholarshipCategory = s.ScholarshipCategory != null ? new { s.ScholarshipCategory.Id, s.ScholarshipCategory.Name } : null,
            ScholarshipType = s.ScholarshipType != null ? new { s.ScholarshipType.Id, s.ScholarshipType.Name } : null
        })
        .ToListAsync();

    return Ok(scholarships);
}
        [HttpGet]
        public async Task<IActionResult> GetAllScholarships()
        {
            var scholarships = await _context.Scholarship
                .Include(s => s.Provider)
                .Include(s => s.ScholarshipCategory)
                .Include(s => s.ScholarshipType)
                .Select(s => new ScholarshipDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    ApplyLink = s.ApplyLink,
                    IsAvailable = s.IsAvailable,
                    Deadline=s.Deadline,
                    ImageFile = s.ImageFile,
                    ProviderId = s.ProviderId,
                    ProviderName = s.Provider.FullName,
                    ScholarshipCategoryId = s.ScholarshipCategoryId,
                    ScholarshipCategoryName = s.ScholarshipCategory.Name,
                    ScholarshipTypeId = s.ScholarshipTypeId,
                    ScholarshipTypeName = s.ScholarshipType.Name
                })
                .ToListAsync();

            return Ok(scholarships);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Scholarship>> GetById(int id)
        {
            var scholarship = await _context.Scholarship
                .Include(s => s.Provider)
                .Include(s => s.ScholarshipCategory)
                .Include(s => s.ScholarshipType)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (scholarship == null)
                return NotFound();

            return scholarship;
        }


        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Scholarship>>> GetAvailable()
        {
            return await _context.Scholarship
                .Where(s => s.IsAvailable)
                .Include(s => s.Provider)
                .Include(s => s.ScholarshipCategory)
                .Include(s => s.ScholarshipType)
                .ToListAsync();
        }


        [HttpPost]
        public async Task<ActionResult<Scholarship>> Create([FromForm] CreateScholarshipDto dto)
        {
            
            if (!await _context.ScholarshipCategory.AnyAsync(c => c.Id == dto.ScholarshipCategoryId))
                return BadRequest("ScholarshipCategoryId nuk ekziston.");

            if (!await _context.ScholarshipType.AnyAsync(t => t.Id == dto.ScholarshipTypeId))
                return BadRequest("ScholarshipTypeId nuk ekziston.");

            var scholarship = new Scholarship
            {
                Title = dto.Title,
                Description = dto.Description,
                ApplyLink = dto.ApplyLink,
                IsAvailable = dto.IsAvailable,
                Deadline = dto.Deadline,

                ProviderId = null,
                ScholarshipCategoryId = dto.ScholarshipCategoryId,
                ScholarshipTypeId = dto.ScholarshipTypeId
            };

            if (dto.ImageFile != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

               scholarship.ImageFile = "/Uploads/" + uniqueFileName;  
            }

            _context.Scholarship.Add(scholarship);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = scholarship.Id }, scholarship);
        }




        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CreateScholarshipDto dto)
        {
            var existing = await _context.Scholarship.FindAsync(id);
            if (existing == null)
                return NotFound();

            if (!await _context.Provider.AnyAsync(p => p.Id == dto.ProviderId))
                return BadRequest("ProviderId nuk ekziston.");

            if (!await _context.ScholarshipCategory.AnyAsync(c => c.Id == dto.ScholarshipCategoryId))
                return BadRequest("ScholarshipCategoryId nuk ekziston.");

            if (!await _context.ScholarshipType.AnyAsync(t => t.Id == dto.ScholarshipTypeId))
                return BadRequest("ScholarshipTypeId nuk ekziston.");

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.ApplyLink = dto.ApplyLink;
            existing.IsAvailable = dto.IsAvailable;
            existing.Deadline = dto.Deadline;
           
            existing.ProviderId = dto.ProviderId;
            existing.ScholarshipCategoryId = dto.ScholarshipCategoryId;
            existing.ScholarshipTypeId = dto.ScholarshipTypeId;

            if (dto.ImageFile != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                existing.ImageFile = "/Uploads/" + uniqueFileName;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var scholarship = await _context.Scholarship.FindAsync(id);
            if (scholarship == null)
                return NotFound();

            _context.Scholarship.Remove(scholarship);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
