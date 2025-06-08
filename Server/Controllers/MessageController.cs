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

    var recipientExists = await _context.Student.AnyAsync(s => s.Id == messageDto.RecipientId)
        || await _context.Provider.AnyAsync(p => p.Id == messageDto.RecipientId)
        || await _context.Admin.AnyAsync(a => a.Id == messageDto.RecipientId);

    if (!recipientExists)
    {
        return BadRequest("Recipient does not exist.");
    }

    if (messageDto.ScholarshipId.HasValue)
    {
        var scholarshipExists = await _context.Scholarship.AnyAsync(s => s.Id == messageDto.ScholarshipId);
        if (!scholarshipExists)
        {
            return BadRequest("Scholarship does not exist.");
        }
    }

    try
    {
        if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var senderId))
        {
            return Unauthorized("Invalid user ID");
        }

        if (string.IsNullOrEmpty(messageDto.Content))
        {
            return BadRequest("Message content is required");
        }

object? sender = null;

var admin = await _context.Admin.FindAsync(senderId);
if (admin != null)
    sender = admin;
else
{
    var provider = await _context.Provider.FindAsync(senderId);
    if (provider != null)
        sender = provider;
    else
    {
        var student = await _context.Student.FindAsync(senderId);
        if (student != null)
            sender = student;
    }
}


var senderName = (sender as dynamic)?.FullName ?? User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";

        var message = new Message
        {
            Content = messageDto.Content,
            Subject = messageDto.Subject,
            SenderId = senderId,
            RecipientId = messageDto.RecipientId,
            ScholarshipId = messageDto.ScholarshipId,
            ParentMessageId = messageDto.ParentMessageId
        };

        _context.Message.Add(message);
        await _context.SaveChangesAsync();

      
        await _notificationService.CreateNotification(
            messageDto.RecipientId,
            $"New message from {senderName}",
            "NewMessage",
            "Message",
            message.Id
        );

        return Ok(new { message.Id });
    }
    catch (Exception ex)
    {
        var inner = ex.InnerException?.Message ?? "No inner exception";
        Console.WriteLine($"SendMessage failed: {ex.Message} | Inner: {inner}");
        return StatusCode(500, $"Error: {ex.Message} | Inner: {inner}");
    }
}


    [HttpGet("received/{recipientId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetReceivedMessages(int recipientId)
    {
        var messages = await _context.Message
            .Where(m => m.RecipientId == recipientId)
            .Where(m => m.RecipientId == recipientId && !m.IsDeletedForRecipient)
             .Include(m => m.Sender) 
            .Include(m => m.Scholarship)
            .OrderByDescending(m => m.SentAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                Subject = m.Subject,
                SentAt = m.SentAt,
                IsRead = m.IsRead,
                SenderId = m.SenderId,
                SenderName = m.Sender != null ? m.Sender.FullName : "Unknown",
                RecipientId = m.RecipientId,
                RecipientName = m.Recipient.FullName ?? "Unknown",
                ScholarshipId = m.ScholarshipId,
                ScholarshipTitle = m.Scholarship != null ? m.Scholarship.Title : string.Empty,
                ParentMessageId = m.ParentMessageId,
                HasReplies = m.Replies.Any()
            })
            .ToListAsync();

        return Ok(messages);
    }
[HttpGet("sent/{userId}")]
public async Task<ActionResult<IEnumerable<MessageDto>>> GetSentMessages(int userId)
{
    var messages = await _context.Message
        .Where(m => m.SenderId == userId)
         .Where(m => m.SenderId == userId && !m.IsDeletedForSender)
        .Include(m => m.Recipient)
        .Include(m => m.Scholarship)
        .OrderByDescending(m => m.SentAt)
        .Select(m => new MessageDto
        {
            Id = m.Id,
            Content = m.Content,
            Subject = m.Subject,
            SentAt = m.SentAt,
            IsRead = m.IsRead,
            SenderId = m.SenderId,
            SenderName = m.Sender.FullName ?? "Unknown",
            RecipientId = m.RecipientId,
            RecipientName = m.Recipient.FullName ?? "Unknown",
            ScholarshipId = m.ScholarshipId,
            ScholarshipTitle = m.Scholarship != null ? m.Scholarship.Title : string.Empty,
            ParentMessageId = m.ParentMessageId,
            HasReplies = m.Replies.Any()
        })
        .ToListAsync();

    return Ok(messages);
}
 [HttpDelete("{id}")]
[Authorize]
public async Task<IActionResult> DeleteMessage(int id)
{
    var claim = User.FindFirst(ClaimTypes.NameIdentifier);
    if (claim == null || !int.TryParse(claim.Value, out var userId))
    {
        return Unauthorized("User ID claim is missing or invalid.");
    }

    var message = await _context.Message.FindAsync(id);
    if (message == null)
    {
        return NotFound("Message not found.");
    }

    var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

   
    if (userRole == "Student" && message.SenderId == userId)
    {
        message.IsDeletedForSender = true;
    }
 
    else if (userRole == "Provider" && message.RecipientId == userId)
    {
        message.IsDeletedForRecipient = true;
    }
    else
    {
        return Forbid("You are not authorized to delete this message.");
    }

    await _context.SaveChangesAsync();
    return NoContent();
}
}