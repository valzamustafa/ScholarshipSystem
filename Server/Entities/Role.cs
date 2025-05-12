namespace Server.Entities;

public class Role
{
    public int Id { get; set; }
    public required string Emri { get; set; }

    public ICollection<User> User { get;  } = new List<User>();

    
}