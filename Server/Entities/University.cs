namespace Server.Entities;
public class University
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public ICollection<Student> Student { get; set; }=new List<Student>();
}