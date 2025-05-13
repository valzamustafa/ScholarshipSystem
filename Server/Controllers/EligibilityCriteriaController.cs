using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EligibilityCriteriaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EligibilityCriteriaController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EligibilityCriteria>>> GetAll()
        {
            return await _context.EligibilityCriteria
                .Include(e => e.Scholarship)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<EligibilityCriteria>> GetById(int id)
        {
            var criteria = await _context.EligibilityCriteria
                .Include(e => e.Scholarship)
                .FirstOrDefaultAsync(e => e.EligibilityCriteriaId == id);

            if (criteria == null)
                return NotFound();

            return criteria;
        }

        
        [HttpPost]
        public async Task<ActionResult<EligibilityCriteria>> Create(EligibilityCriteria criteria)
        {
            _context.EligibilityCriteria.Add(criteria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = criteria.EligibilityCriteriaId }, criteria);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EligibilityCriteria updatedCriteria)
        {
            if (id != updatedCriteria.EligibilityCriteriaId)
                return BadRequest("ID nuk përputhet.");

            var existing = await _context.EligibilityCriteria.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.CriteriaDescription = updatedCriteria.CriteriaDescription;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var criteria = await _context.EligibilityCriteria.FindAsync(id);
            if (criteria == null)
                return NotFound();

            _context.EligibilityCriteria.Remove(criteria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
