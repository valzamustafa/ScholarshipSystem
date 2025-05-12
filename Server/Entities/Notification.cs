namespace Server.Entities;

public class Notification
{
    public int Id { get; set; }
    
    public required string Message { get; set; }
    public DateTime DateSent { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; }=null!;
}
