using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScholarshipTypeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScholarshipTypeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScholarshipType>>> GetAll()
        {
            return await _context.ScholarshipType.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScholarshipType>> GetById(int id)
        {
            var type = await _context.ScholarshipType.FindAsync(id);
            if (type == null)
                return NotFound();

            return type;
        }

        [HttpPost]
        public async Task<ActionResult<ScholarshipType>> Create(ScholarshipType type)
        {
            _context.ScholarshipType.Add(type);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = type.Id }, type);
        }

[HttpGet("all-with-counts")]
public async Task<ActionResult<IEnumerable<object>>> GetAllWithCounts()
{
    var types = await _context.ScholarshipType
        .Include(t => t.Scholarship)
        .Select(t => new 
        {
            t.Id,
            t.Name,
            t.Description,
            ScholarshipCount = t.Scholarship.Count,
            CreatedByProvider = t.Scholarship.Any(s => s.ProviderId != null)
        })
        .ToListAsync();

    return Ok(types);
}

[HttpPut("admin/{id}")]
public async Task<IActionResult> UpdateByAdmin(int id, [FromBody] ScholarshipType updatedType)
{
    var existing = await _context.ScholarshipType.FindAsync(id);
    if (existing == null)
        return NotFound();

    existing.Name = updatedType.Name;
    existing.Description = updatedType.Description;

    await _context.SaveChangesAsync();
    return Ok(existing);
}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ScholarshipType updatedType)
        {
            if (id != updatedType.Id)
                return BadRequest("ID mismatch");

            var existing = await _context.ScholarshipType.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = updatedType.Name;
            existing.Description = updatedType.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var type = await _context.ScholarshipType.FindAsync(id);
            if (type == null)
                return NotFound();

            _context.ScholarshipType.Remove(type);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}