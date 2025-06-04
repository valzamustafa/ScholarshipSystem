namespace Server.Dtos
{
    public class SendMessageDto
    {
        public required string Subject { get; set; }
        public string? Content { get; set; }
       public int RecipientId { get; set; } 
        public int? ScholarshipId { get; set; }
         public int? ParentMessageId { get; set; }
    }
}