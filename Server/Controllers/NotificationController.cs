using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Authorization;
using Server.Services;
using Server.Dtos;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly ICurrentUserService _currentUserService;

        public NotificationController(
            AppDbContext context,
            INotificationService notificationService,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _notificationService = notificationService;
            _currentUserService = currentUserService;
        }
[HttpPost("create")]
public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var notification = new Notification
    {
        Message = dto.Message,
        NotificationType = dto.NotificationType,
        RelatedEntityType = dto.RelatedEntityType,
        RelatedEntityId = dto.RelatedEntityId,
        UserId = dto.UserId,
        DateSent = DateTime.UtcNow,
        IsRead = false
    };

    _context.Notification.Add(notification);
    await _context.SaveChangesAsync();

    var resultDto = new NotificationDto
    {
        Id = notification.Id,
        Message = notification.Message,
        NotificationType = notification.NotificationType,
        RelatedEntityType = notification.RelatedEntityType,
        RelatedEntityId = notification.RelatedEntityId,
        UserId = notification.UserId,
        DateSent = notification.DateSent,
        IsRead = notification.IsRead,
        Icon = GetNotificationIcon(notification.NotificationType)
    };

    return Ok(resultDto);
}

[HttpGet("for-user")]
[Authorize]
public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotificationsForCurrentUser()
{
    try
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
            return Unauthorized(new { message = "User not authenticated" });

        var notifications = await _context.Notification
            .Where(n => n.UserId == userId.Value)
            .OrderByDescending(n => n.DateSent)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                DateSent = n.DateSent,
                IsRead = n.IsRead,
                NotificationType = n.NotificationType,
                RelatedEntityType = n.RelatedEntityType,
                RelatedEntityId = n.RelatedEntityId,
                Icon = GetNotificationIcon(n.NotificationType)
            })
            .ToListAsync();

        return Ok(notifications);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred", error = ex.Message });
    }
}
[HttpGet("for-user/{userId}")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<IEnumerable<NotificationDto>>> GetUserNotifications(int userId)
{
    var notifications = await _context.Notification
        .Where(n => n.UserId == userId)
        .OrderByDescending(n => n.DateSent)
        .Select(n => new NotificationDto
        {
            Id = n.Id,
            Message = n.Message,
            DateSent = n.DateSent,
            IsRead = n.IsRead,
            NotificationType = n.NotificationType,
            RelatedEntityType = n.RelatedEntityType,
            RelatedEntityId = n.RelatedEntityId,
            Icon = GetNotificationIcon(n.NotificationType)
        })
        .ToListAsync();

    return Ok(notifications);
}

private static string GetNotificationIcon(string notificationType)
{
    return notificationType switch
    {
        "ApplicationSubmitted" => "📤",
        "ApplicationAccepted" => "✅",
        "ApplicationRejected" => "❌",
        "ApplicationStatusUpdated" => "⏳",
        "DeadlineApproaching" => "📅",
        "NewMatchingScholarship" => "🆕",
        "NewApplication" => "🧑‍🎓",
        "ApplicationDecisionConfirmed" => "✅",
        "ScholarshipExpiringSoon" => "⚠️",
        "AdminFeedback" => "📝",
        "NewScholarshipAdded" => "🏆",
        "NewStudentRegistered" => "👨‍🎓",
        "UserReport" => "🚨",
        "MonthlyStatistics" => "📊",
        _ => "🔔"
    };
}

     [HttpGet]
public async Task<ActionResult<IEnumerable<NotificationDto>>> GetUserNotifications()
{
    var userId = _currentUserService.UserId;
    if (userId == null)
        return Unauthorized();

    var notifications = await _notificationService.GetUserNotifications(userId.Value);
    return Ok(notifications);
}

[HttpGet("unread-count")]
public async Task<ActionResult<int>> GetUnreadCount()
{
    var userId = _currentUserService.UserId;
    if (userId == null)
        return Unauthorized();

    var count = await _notificationService.GetUnreadCount(userId.Value);
    return Ok(count);
}

[HttpPut("mark-all-read")]
public async Task<IActionResult> MarkAllAsRead()
{
    var userId = _currentUserService.UserId;
    var unreadNotifications = await _context.Notification
        .Where(n => n.UserId == userId && !n.IsRead)
        .ToListAsync();

    foreach (var notification in unreadNotifications)
    {
        notification.IsRead = true;
    }

    await _context.SaveChangesAsync();
    return NoContent();
}
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            await _notificationService.MarkAsRead(id);
            return NoContent();
        }


        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetAllNotifications()
        {
            return await _context.Notification
                .Include(n => n.User)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Notification>> GetNotification(int id)
        {
            var notification = await _context.Notification
                .Include(n => n.User)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (notification == null)
            {
                return NotFound();
            }

            return notification;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Notification>> CreateNotification(Notification notification)
        {
            _context.Notification.Add(notification);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }
        [HttpGet("admin")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAdminNotifications()
{
    try
    {
        var notifications = await _context.Notification
            .OrderByDescending(n => n.DateSent)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                DateSent = n.DateSent,
                IsRead = n.IsRead,
                NotificationType = n.NotificationType,
                RelatedEntityType = n.RelatedEntityType,
                RelatedEntityId = n.RelatedEntityId,
                Icon = GetNotificationIcon(n.NotificationType)
            })
            .ToListAsync();

        return Ok(notifications);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred", error = ex.Message });
    }
}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateNotification(int id, Notification notification)
        {
            if (id != notification.Id)
                return BadRequest();

            _context.Entry(notification).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notification.FindAsync(id);
            if (notification == null)
                return NotFound();

            _context.Notification.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotificationExists(int id)
        {
            return _context.Notification.Any(n => n.Id == id);
        }
    }
}