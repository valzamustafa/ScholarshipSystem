public class RegisterStudentDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string SchoolOrUniversityName { get; set; } = string.Empty;
    public string StudyField { get; set; } = string.Empty;
    public int StudentLevelId { get; set; }  // Shto këtë fushë
}
