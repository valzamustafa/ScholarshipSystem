using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Data;
using Server.Services;
using System.Security.Claims;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackDto createFeedbackDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { message = "User ID claim not found." });

                var currentUserId = int.Parse(userIdClaim);

                var student = await _context.Student
                    .FirstOrDefaultAsync(s => s.Id == currentUserId);

                if (student == null)
                    return BadRequest(new { message = "Only students can submit feedback" });

                var feedback = new Feedback
                {
                    Comment = createFeedbackDto.Comment,
                    Rating = createFeedbackDto.Rating,
                    UserId = currentUserId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Feedback.Add(feedback);
                await _context.SaveChangesAsync();

                // Send notification to the student
                await _notificationService.CreateNotification(
                    currentUserId,
                    "Your feedback has been submitted successfully!",
                    "FeedbackSubmitted",
                    "Feedback",
                    feedback.Id
                );

                // Send notifications to admins
                var admins = await _context.Admin.ToListAsync();
                foreach (var admin in admins)
                {
                    await _notificationService.CreateNotification(
                        admin.Id,
                        $"New feedback received from {student.FullName}",
                        "NewFeedback",
                        "Feedback",
                        feedback.Id
                    );
                }

                var feedbackDto = new FeedbackDto
                {
                    Id = feedback.Id,
                    Comment = feedback.Comment,
                    Rating = feedback.Rating,
                    UserId = feedback.UserId,
                    UserFullName = student.FullName,
                    CreatedAt = feedback.CreatedAt
                };

                return CreatedAtAction(nameof(GetFeedback), new { id = feedback.Id }, feedbackDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
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
                    Comment = f.Comment ?? string.Empty,
                    Rating = f.Rating,
                    UserId = f.UserId,
                    UserFullName = f.User != null ? f.User.FullName ?? string.Empty : string.Empty,
                    ScholarshipId = f.ScholarshipId,
                    ScholarshipTitle = f.Scholarship != null ? f.Scholarship.Title ?? string.Empty : string.Empty,
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
                    Comment = f.Comment ?? string.Empty,
                    Rating = f.Rating,
                    UserId = f.UserId,
                    UserFullName = f.User != null ? f.User.FullName ?? string.Empty : string.Empty,
                    ScholarshipId = f.ScholarshipId,
                    ScholarshipTitle = f.Scholarship != null ? f.Scholarship.Title ?? string.Empty : string.Empty,
                    CreatedAt = f.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (feedback == null)
                return NotFound();

            return Ok(feedback);
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
                    Comment = f.Comment ?? string.Empty,
                    Rating = f.Rating,
                    UserId = f.UserId,
                    UserFullName = f.User != null ? f.User.FullName ?? string.Empty : string.Empty,
                    ScholarshipId = f.ScholarshipId,
                    ScholarshipTitle = f.Scholarship != null ? f.Scholarship.Title ?? string.Empty : string.Empty,
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