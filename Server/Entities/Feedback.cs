namespace Server.Entities;

public class Feedback
{
    public int Id { get; set; }
    public required string Comment { get; set; }
    public int Rating { get; set; }
    public int UserId { get; set; }
    public  User User { get; set; } = null!;

    public int ScholarshipId { get; set; } 
    public Scholarship Scholarship { get; set; } =null!;
}
