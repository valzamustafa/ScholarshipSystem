namespace Server.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public required string Subject { get; set; }
        public string? Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
         public string RecipientName { get; set; } = string.Empty;
    public int? RecipientId { get; set; }
    public int? ParentMessageId { get; set; }
    public bool HasReplies { get; set; }
         public int SenderId { get; set; }
        public required string SenderName { get; set; }
           public int? ScholarshipId { get; set; }
        public required string ScholarshipTitle { get; set; }
    }
}



