public class StudentDto : UserDto
{
    public override string Role => "student";

    public string SchoolOrUniversityName { get; set; } = string.Empty;
    public string StudyField { get; set; } = string.Empty;
    public int StudentLevelId { get; set; }
    public string StudentLevelName { get; set; } = string.Empty;  
    public ICollection<ApplicationDto> Applications { get; set; } = new List<ApplicationDto>();
}
