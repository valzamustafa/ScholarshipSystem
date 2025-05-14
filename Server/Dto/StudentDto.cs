public class StudentDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SchoolOrUniversityName { get; set; } = string.Empty;
    public string StudyField { get; set; } = string.Empty;
    public int StudentLevelId { get; set; }
    public string StudentLevelName { get; set; } = string.Empty;  // Emri i nivelit të studentit
    public ICollection<ApplicationDto> Applications { get; set; } = new List<ApplicationDto>(); // Baza e aplikacioneve të studentit
}
