using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Data;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

    
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
        {
            return await _context.Feedback
                .Include(f => f.User)
                .Include(f => f.Scholarship)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetFeedback(int id)
        {
            var feedback = await _context.Feedback
                .Include(f => f.User)
                .Include(f => f.Scholarship)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (feedback == null)
                return NotFound();

            return feedback;
        }

        
        [HttpPost]
        public async Task<ActionResult<Feedback>> CreateFeedback(Feedback feedback)
        {
            _context.Feedback.Add(feedback);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFeedback), new { id = feedback.Id }, feedback);
        }

    
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeedback(int id, Feedback feedback)
        {
            if (id != feedback.Id)
                return BadRequest();

            _context.Entry(feedback).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            var feedback = await _context.Feedback.FindAsync(id);
            if (feedback == null)
                return NotFound();

            _context.Feedback.Remove(feedback);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FeedbackExists(int id)
        {
            return _context.Feedback.Any(f => f.Id == id);
        }
    }
}
