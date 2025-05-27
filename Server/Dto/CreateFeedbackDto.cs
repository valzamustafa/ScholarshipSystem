public class CreateFeedbackDto
{
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int UserId { get; set; }
    public int ScholarshipId { get; set; }
     public bool AllowFollowUp { get; set; } 
}
