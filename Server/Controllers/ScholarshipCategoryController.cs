using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScholarshipCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScholarshipCategoryController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScholarshipCategory>>> GetAll()
        {
            return await _context.ScholarshipCategory
                .Include(c => c.Scholarship)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<ScholarshipCategory>> GetById(int id)
        {
            var category = await _context.ScholarshipCategory
                .Include(c => c.Scholarship)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            return category;
        }

        
          [HttpPost]
public IActionResult Create([FromBody] ScholarshipCategory category)
{
    try
    {
        _context.ScholarshipCategory.Add(category);
        _context.SaveChanges();
        return Ok(category);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}


        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ScholarshipCategory updatedCategory)
        {
            if (id != updatedCategory.Id)
                return BadRequest("ID nuk përputhet.");

            var existing = await _context.ScholarshipCategory.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = updatedCategory.Name;
            existing.Description = updatedCategory.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.ScholarshipCategory.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.ScholarshipCategory.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
