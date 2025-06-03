public class FeedbackDto
{
    public int Id { get; set; }
    public required string Comment { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    public required string UserFullName { get; set; }
    public int? ScholarshipId { get; set; } 
    public string? ScholarshipTitle { get; set; } 
    public DateTime CreatedAt { get; set; }
    public bool IsFeatured { get; set; }
}