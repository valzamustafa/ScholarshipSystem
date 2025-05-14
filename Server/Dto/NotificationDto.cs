public class NotificationDto
{
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime DateSent { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty; // Mund të shtohet emri i përdoruesit
}
