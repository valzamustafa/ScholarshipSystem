namespace Server.Entities;
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
}