namespace Server.Entities;

public class Role
{
    public int Id { get; set; }
    public required string Emri { get; set; }

    public ICollection<Student> Students { get; } = new List<Student>();
public ICollection<Provider> Provider{ get; } = new List<Provider>();

public ICollection<Admin> Admin{ get; } = new List<Admin>();
    
}