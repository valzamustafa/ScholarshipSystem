namespace Server.Entities;
public class AuditLog
{
    public int Id { get; set; }
   
    public required string Action { get; set; }
    public DateTime ActionDate { get; set; }

    public int UserId { get; set; }
    public  User User { get; set; } = null!;
}
