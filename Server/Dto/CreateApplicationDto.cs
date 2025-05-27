public class CreateApplicationDto
{
    public int StudentId { get; set; }
    public int ScholarshipId { get; set; }
    public int ApplicationStatusId { get; set; }
      public IFormFile? CvFile { get; set; }
    public IFormFile? MotivationLetterFile { get; set; }
    public IFormFile? PortfolioFile { get; set; }
       
    public List<string> ApplicationDocument { get; set; } = new List<string>();
    public string? Gpa { get; set; }
    public string? StudyYear { get; set; }
    public string? StudyField { get; set; }
}
