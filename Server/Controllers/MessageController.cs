using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Dtos;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using Server.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Server.DTOs;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly AppDbContext _context;
 private readonly INotificationService _notificationService;
    public MessageController(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
          _notificationService = notificationService;
    }

  [HttpPost]
public async Task<IActionResult> SendMessage([FromBody] SendMessageDto messageDto)
{
    if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var senderId))
    {
        return Unauthorized("Invalid user ID");
    }

    if (string.IsNullOrEmpty(messageDto.Content))
    {
        return BadRequest("Message content is required");
    }

    var message = new Message
    {
        Content = messageDto.Content,
        Subject=messageDto.Subject,
        SenderId = senderId,
        RecipientId = messageDto.RecipientId,
        ScholarshipId = messageDto.ScholarshipId
    };

    _context.Message.Add(message);
    await _context.SaveChangesAsync();
        await _notificationService.CreateNotification(
           messageDto.RecipientId,
           $"New message from {User.FindFirst(ClaimTypes.Name)?.Value}",
           "NewMessage",
           "Message",
           message.Id
        );

    return Ok(new { message.Id });
}

    [HttpGet("received/{recipientId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetReceivedMessages(int recipientId)
    {
        var messages = await _context.Message
            .Where(m => m.RecipientId == recipientId)
            .Include(m => m.Sender)
            .Include(m => m.Scholarship)
            .OrderByDescending(m => m.SentAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                  Subject=m.Subject,
                SentAt = m.SentAt,
                IsRead = m.IsRead,
                SenderName = m.Sender.FullName,
               ScholarshipTitle = m.Scholarship != null ? m.Scholarship.Title : string.Empty
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var message = await _context.Message.FindAsync(id);
        if (message == null) return NotFound();

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

