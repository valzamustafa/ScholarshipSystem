using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Data;      
using Server.DTOs;    
using Server.Entities;
public class ContactService : IContactService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ContactService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ContactMessageDto> CreateMessageAsync(ContactMessageDto contactMessageDto)
    {
        var message = _mapper.Map<ContactMessage>(contactMessageDto);
        _context.ContactMessage.Add(message);
        await _context.SaveChangesAsync();
        return _mapper.Map<ContactMessageDto>(message);
    }

    public async Task<IEnumerable<ContactMessageDto>> GetAllMessagesAsync()
    {
        var messages = await _context.ContactMessage.ToListAsync();
        return _mapper.Map<IEnumerable<ContactMessageDto>>(messages);
    }

    public async Task<ContactMessageDto> GetMessageByIdAsync(int id)
    {
        var message = await _context.ContactMessage.FindAsync(id);
        return _mapper.Map<ContactMessageDto>(message);
    }

   public async Task<bool> DeleteMessageAsync(int id)
{
    var message = await _context.ContactMessage.FindAsync(id);
    if (message == null) return false;
    
    _context.ContactMessage.Remove(message);
    await _context.SaveChangesAsync();
    return true;
}
    public async Task MarkAsReadAsync(int id)
    {
        var message = await _context.ContactMessage.FindAsync(id);
        if (message != null)
        {
            message.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }
}