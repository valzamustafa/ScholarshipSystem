using Server.DTOs;

public class ConversationDto
{
    public List<MessageDto> Messages { get; set; } = new List<MessageDto>();
    public int? ScholarshipId { get; set; }
    public string ScholarshipTitle { get; set; } = string.Empty;
}