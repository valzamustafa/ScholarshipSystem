public class UpdateFeedbackDto
{
    public int Id { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int UserId { get; set; }
    public int ScholarshipId { get; set; }
}
