namespace Server.DTOs
{
    public class CreateScholarshipAwardDto
    {
        public int ScholarshipId { get; set; }
        public int StudentId { get; set; }
        public required string AwardDate { get; set; } 
        
    }
}
