namespace Server.Entities;

public class Notification
{
    public int Id { get; set; }
    
    public required string Message { get; set; }
    public DateTime DateSent { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    public  required string NotificationType  { get; set; }
    public string? RelatedEntityType { get; set; }
    public int? RelatedEntityId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }=null!;
}
