namespace Server.Dtos
{
    public class AuditLogDto
    {
        public  required string Action { get; set; }
        public string? Details { get; set; }
        public DateTime Timestamp { get; set; }
    }
}