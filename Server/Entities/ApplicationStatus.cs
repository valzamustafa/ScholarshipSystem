namespace Server.Entities;
public class ApplicationStatus
{
    public int Id { get; set; }
    public required string StatusName { get; set; }
    
    public ICollection<Application> Application { get; set; }=new List<Application>();
}