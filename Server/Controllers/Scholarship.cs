using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScholarshipController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScholarshipController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Scholarship>>> GetAll()
        {
            return await _context.Scholarship
                .Include(s => s.Provider)
                .Include(s => s.ScholarshipCategory)
                .Include(s => s.ScholarshipType)
                .ToListAsync();
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
        public async Task<ActionResult<Scholarship>> Create(Scholarship scholarship)
        {
            
            if (!await _context.Provider.AnyAsync(p => p.Id == scholarship.ProviderId))
                return BadRequest("ProviderId nuk ekziston.");

            if (!await _context.ScholarshipCategory.AnyAsync(c => c.Id == scholarship.ScholarshipCategoryId))
                return BadRequest("ScholarshipCategoryId nuk ekziston.");

            if (!await _context.ScholarshipType.AnyAsync(t => t.Id == scholarship.ScholarshipTypeId))
                return BadRequest("ScholarshipTypeId nuk ekziston.");

            _context.Scholarship.Add(scholarship);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = scholarship.Id }, scholarship);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Scholarship updatedScholarship)
        {
            if (id != updatedScholarship.Id)
                return BadRequest("ID nuk përputhet.");

            var existing = await _context.Scholarship.FindAsync(id);
            if (existing == null)
                return NotFound();

            // Validime për foreign keys
            if (!await _context.Provider.AnyAsync(p => p.Id == updatedScholarship.ProviderId))
                return BadRequest("ProviderId nuk ekziston.");

            if (!await _context.ScholarshipCategory.AnyAsync(c => c.Id == updatedScholarship.ScholarshipCategoryId))
                return BadRequest("ScholarshipCategoryId nuk ekziston.");

            if (!await _context.ScholarshipType.AnyAsync(t => t.Id == updatedScholarship.ScholarshipTypeId))
                return BadRequest("ScholarshipTypeId nuk ekziston.");

            
            existing.Title = updatedScholarship.Title;
            existing.Description = updatedScholarship.Description;
            existing.ApplyLink = updatedScholarship.ApplyLink;
            existing.IsAvailable = updatedScholarship.IsAvailable;
            existing.ProviderId = updatedScholarship.ProviderId;
            existing.ScholarshipCategoryId = updatedScholarship.ScholarshipCategoryId;
            existing.ScholarshipTypeId = updatedScholarship.ScholarshipTypeId;

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
