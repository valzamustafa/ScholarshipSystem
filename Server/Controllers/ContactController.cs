using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Authorization;
using Server.Services;
namespace Server.Controllers
{



    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
         private readonly AppDbContext _context;
                private readonly IContactService _contactService;
 private readonly INotificationService _notificationService;
        public ContactController(    AppDbContext context,IContactService contactService, INotificationService notificationService)
        {
              _context = context;
            _contactService = contactService;
             _notificationService = notificationService;
        }

        [HttpPost]
public async Task<IActionResult> CreateMessage([FromBody] ContactMessageDto contactMessageDto)
{
    var createdMessage = await _contactService.CreateMessageAsync(contactMessageDto);
    
    
    var admins = await _context.Admin.ToListAsync();
    foreach (var admin in admins)
    {
        await _notificationService.CreateNotification(
            admin.Id,
            $"New contact message from {contactMessageDto.Name}",
            "NewContactMessage",
            "ContactMessage",
            createdMessage.Id
        );
    }

    return CreatedAtAction(nameof(GetMessageById), new { id = createdMessage.Id }, createdMessage);
}
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _contactService.GetAllMessagesAsync();
            return Ok(messages);
        }

[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> DeleteMessage(int id)
{
    var result = await _contactService.DeleteMessageAsync(id);
    if (!result) return NotFound();
    return NoContent();
}

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMessageById(int id)
        {
            var message = await _contactService.GetMessageByIdAsync(id);
            if (message == null) return NotFound();
            return Ok(message);
        }

        [HttpPut("{id}/mark-as-read")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            await _contactService.MarkAsReadAsync(id);
            return NoContent();
        }
    }
}