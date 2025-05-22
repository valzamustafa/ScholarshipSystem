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