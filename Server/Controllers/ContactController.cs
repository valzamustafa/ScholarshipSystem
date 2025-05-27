using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Microsoft.AspNetCore.Authorization;
namespace Server.Controllers
{



    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] ContactMessageDto contactMessageDto)
        {
            var createdMessage = await _contactService.CreateMessageAsync(contactMessageDto);
            return CreatedAtAction(nameof(GetMessageById), new { id = createdMessage.Id }, createdMessage);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _contactService.GetAllMessagesAsync();
            return Ok(messages);
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