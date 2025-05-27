public class ApplicationDto
{
    public int Id { get; set; }
    public DateTime ApplicationDate { get; set; }
    public int ApplicationStatusId { get; set; }
    public string ApplicationStatusName { get; set; } = string.Empty;
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int ScholarshipId { get; set; }
    public string ScholarshipTitle { get; set; } = string.Empty;
    public List<ApplicationDocumentDto> ApplicationDocument { get; set; } = new List<ApplicationDocumentDto>();
}