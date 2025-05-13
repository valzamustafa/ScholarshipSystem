using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UniversityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UniversityController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<University>>> GetAll()
        {
            return await _context.University
                .Include(u => u.Student)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<University>> GetById(int id)
        {
            var university = await _context.University
                .Include(u => u.Student)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (university == null)
                return NotFound();

            return university;
        }

        
        [HttpPost]
        public async Task<ActionResult<University>> Create(University university)
        {
            _context.University.Add(university);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = university.Id }, university);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, University updatedUniversity)
        {
            if (id != updatedUniversity.Id)
                return BadRequest("ID nuk përputhet.");

            var existing = await _context.University.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = updatedUniversity.Name;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var university = await _context.University.FindAsync(id);
            if (university == null)
                return NotFound();

            _context.University.Remove(university);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
