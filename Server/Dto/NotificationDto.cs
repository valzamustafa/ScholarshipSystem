public class NotificationDto
{
    public int Id { get; set; }
    public required string Message { get; set; }
    public DateTime DateSent { get; set; }
    public bool IsRead { get; set; }
     public int UserId { get; set; }
    public required string NotificationType { get; set; }
    public string? RelatedEntityType { get; set; }
    public int? RelatedEntityId { get; set; }
    public string? Icon { get; set; }
    
}