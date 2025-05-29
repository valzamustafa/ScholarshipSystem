public class UpdateStudentDto
{
    public int Id { get; set; }
     public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SchoolOrUniversityName { get; set; } = string.Empty;
    public string StudyField { get; set; } = string.Empty;
    public int StudentLevelId { get; set; }
}
