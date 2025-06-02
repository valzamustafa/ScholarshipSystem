public class CreateNotificationDto
{
    [Required]
    public string Message { get; set; } = null!;
    
    [Required]
    public string NotificationType { get; set; } = null!;

    public string? RelatedEntityType { get; set; }

    public int? RelatedEntityId { get; set; }

    [Required]
    public int UserId { get; set; }
}
