public class ScholarshipAwardDto
{
    public int Id { get; set; }
    public DateTime AwardDate { get; set; }
    public required string StudentName { get; set; }
    public required string ScholarshipTitle { get; set; }
    public required string StudentEmail { get; set; }
    public string? StudentPhone { get; set; }
    
}