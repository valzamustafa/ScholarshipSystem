public class CreateStudentDto
{
    [Required]
    public required string FullName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    public required string SchoolOrUniversityName { get; set; }
    public required string StudyField { get; set; }

    [Required]
    public int StudentLevelId { get; set; }

    [Required]
    public int RoleId { get; set; }
     [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}