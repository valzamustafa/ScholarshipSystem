namespace Server.Entities;
public class AcademicYear
{
    public int Id { get; set; }
    public required string Year { get; set; }
    
    public ICollection<Scholarship> Scholarship { get; set; }=new List<Scholarship>();
}