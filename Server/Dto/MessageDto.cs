namespace Server.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public required string Subject { get; set; }
        public string? Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public required string SenderName { get; set; }
        public required string ScholarshipTitle { get; set; }
    }
}



