public class CreateApplicationDto
{
    public int StudentId { get; set; }
    public int ScholarshipId { get; set; }
    public int ApplicationStatusId { get; set; }
    public string MotivationLetter { get; set; } = string.Empty;
    public List<string> ApplicationDocument { get; set; } = new List<string>();
    public string? Gpa { get; set; }
    public string? StudyYear { get; set; }
    public string? StudyField { get; set; }
    public string? Portfolio { get; set; }
    public string? CvLink { get; set; }
}
