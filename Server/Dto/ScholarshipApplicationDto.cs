namespace Server.DTOs
{
    public class ScholarshipApplicationDto
    {
        public int Id { get; set; }
        public string ScholarshipTitle { get; set; } = null!;
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public string? StudentPhone { get; set; } 
        public string Status { get; set; } = null!;
    }
}
