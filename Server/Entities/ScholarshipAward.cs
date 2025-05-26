namespace Server.Entities;
public class ScholarshipAward
{
    public int Id { get; set; }
    public DateTime AwardDate { get; set; }
    
    public int ScholarshipId { get; set; }
    public Scholarship Scholarship { get; set; }=null!;
    public int StudentId { get; set; }
    public Student Student { get; set; }=null!;
}