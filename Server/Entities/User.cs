namespace Server.Entities;

public abstract class User
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber{ get; set; } 
    public string? PasswordHash { get; set; }
    public bool IsApproved { get; set; }

   
    public ICollection<Notification> Notification { get; } = new List<Notification>();
    public ICollection<Feedback> Feedback { get;}=new List<Feedback>();
    public ICollection<AuditLog> AuditLog { get;}=new List<AuditLog>();
    public ICollection<UserActivityLog> UserActivityLog { get;}=new List<UserActivityLog>();
}
