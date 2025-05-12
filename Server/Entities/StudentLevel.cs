namespace Server.Entities;
public class StudentLevel
{
    public int Id { get; set; }
    public  required string Level { get; set; }
    
    public ICollection<Student> Student { get; }=new List<Student>();
}
