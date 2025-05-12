namespace Server.Entities;

public class UserActivityLog
{
    public int Id { get; set; }
    
    public required string Activity { get; set; }
    public DateTime ActivityDate { get; set; }
    public required ActivityType ActivityType { get; set; } 
    public int UserId  { get; set; }
    public User User { get; set; }=null!;
}
