public interface IContactService
{
    Task<ContactMessageDto> CreateMessageAsync(ContactMessageDto contactMessageDto);
    Task<IEnumerable<ContactMessageDto>> GetAllMessagesAsync();
    Task<ContactMessageDto> GetMessageByIdAsync(int id);
    Task MarkAsReadAsync(int id);
}