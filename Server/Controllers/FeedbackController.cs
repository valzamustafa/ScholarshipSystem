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
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetFeedbacks()
        {
            var feedbacks = await _context.Feedback
                .Include(f => f.User)
                .Include(f => f.Scholarship)
                .Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    Comment = f.Comment,
                    Rating = f.Rating,
                    UserId = f.UserId,
                    UserFullName = f.User.FullName,
                    ScholarshipId = f.ScholarshipId,
                    ScholarshipTitle = f.Scholarship.Title,
                    CreatedAt = f.CreatedAt
                })
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return Ok(feedbacks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackDto>> GetFeedback(int id)
        {
            var feedback = await _context.Feedback
                .Include(f => f.User)
                .Include(f => f.Scholarship)
                .Where(f => f.Id == id)
                .Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    Comment = f.Comment,
                    Rating = f.Rating,
                    UserId = f.UserId,
                    UserFullName = f.User.FullName,
                    ScholarshipId = f.ScholarshipId,
                    ScholarshipTitle = f.Scholarship.Title,
                    CreatedAt = f.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (feedback == null)
                return NotFound();

            return Ok(feedback);
        }

        [HttpPost]
        public async Task<ActionResult<FeedbackDto>> CreateFeedback(CreateFeedbackDto createFeedbackDto)
        {
            try
            {
                var student = await _context.Student
                    .FirstOrDefaultAsync(s => s.Id == createFeedbackDto.UserId);

                if (student == null)
                    return BadRequest(new { message = "Only students can submit feedback" });

                var scholarship = await _context.Scholarship.FindAsync(createFeedbackDto.ScholarshipId);
                if (scholarship == null)
                    return BadRequest(new { message = "Scholarship not found" });

                var feedback = new Feedback
                {
                    Comment = createFeedbackDto.Comment,
                    Rating = createFeedbackDto.Rating,
                    UserId = createFeedbackDto.UserId,
                    ScholarshipId = createFeedbackDto.ScholarshipId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Feedback.Add(feedback);
                await _context.SaveChangesAsync();

                var feedbackDto = new FeedbackDto
                {
                    Id = feedback.Id,
                    Comment = feedback.Comment,
                    Rating = feedback.Rating,
                    UserId = feedback.UserId,
                    UserFullName = student.FullName,
                    ScholarshipId = feedback.ScholarshipId,
                    ScholarshipTitle = scholarship.Title,
                    CreatedAt = feedback.CreatedAt
                };

                return CreatedAtAction(nameof(GetFeedback), new { id = feedback.Id }, feedbackDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
[HttpPut("{id}/feature")]
public async Task<IActionResult> ToggleFeaturedStatus(int id)
{
    var feedback = await _context.Feedback.FindAsync(id);
    if (feedback == null)
        return NotFound();

    feedback.IsFeatured = !feedback.IsFeatured;
    await _context.SaveChangesAsync();

    return NoContent();
}

[HttpGet("featured")]
public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetFeaturedFeedbacks()
{
    var featuredFeedbacks = await _context.Feedback
        .Include(f => f.User)
        .Include(f => f.Scholarship)
        .Where(f => f.IsFeatured)
        .Select(f => new FeedbackDto
        {
            Id = f.Id,
            Comment = f.Comment,
            Rating = f.Rating,
            UserId = f.UserId,
            UserFullName = f.User.FullName,
            ScholarshipId = f.ScholarshipId,
            ScholarshipTitle = f.Scholarship.Title,
            CreatedAt = f.CreatedAt,
            IsFeatured = f.IsFeatured
        })
        .OrderByDescending(f => f.CreatedAt)
        .ToListAsync();

    return Ok(featuredFeedbacks);
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
