public class UpdateStudentDto
{
    public int Id { get; set; }
    public string SchoolOrUniversityName { get; set; } = string.Empty;
    public string StudyField { get; set; } = string.Empty;
    public int StudentLevelId { get; set; }
}
