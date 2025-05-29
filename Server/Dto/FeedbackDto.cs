public class FeedbackDto
{
    public int Id { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int UserId { get; set; }
    public bool IsFeatured { get; set; }
        public string UserFullName { get; set; } = string.Empty;
    public int ScholarshipId { get; set; }
     public DateTime CreatedAt { get; set; }
    public string ScholarshipTitle { get; set; } = string.Empty;
}
