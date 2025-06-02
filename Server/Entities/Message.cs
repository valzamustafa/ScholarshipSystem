// At the top of Message.cs
using System;
using Server.Entities; // Where User and Scholarship are defined

namespace Server.Entities
{
    public class Message
    {
        public int Id { get; set; }
         public required string Subject { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        
        public int SenderId { get; set; }
        public User Sender { get; set; } = null!;
        
        public int RecipientId { get; set; }
        public User Recipient { get; set; } = null!;
        
        public int? ScholarshipId { get; set; }
        public Scholarship? Scholarship { get; set; }
    }
}