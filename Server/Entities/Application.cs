namespace Server.Entities
{
    public class Application
    {
        public int Id { get; set; }
        public DateTime ApplicationDate { get; set; }
        public int ApplicationStatusId { get; set; }  
        public ApplicationStatus ApplicationStatus { get; set; } = null!;
        public int StudentId { get; set; }
        public Student Student { get; set; }=null!;
        public int ScholarshipId { get; set; }
        public Scholarship Scholarship { get; set; }=null!;
        public ICollection<ApplicationDocument> ApplicationDocument { get; set; }=new List<ApplicationDocument>();

       
        public string? MotivationLetter { get; set; }
        public string? Gpa { get; set; }
        public string? StudyYear { get; set; }
        public string? StudyField { get; set; }
        public string? Portfolio { get; set; }
        public string? CvLink { get; set; }
    }
}
