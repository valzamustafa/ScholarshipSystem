namespace Server.Entities;
public class ScholarshipCategory
{
    public int Id { get; set; }

    public required string Name { get; set; }
    public required string Description { get; set; } //Lloji i burses 

    
    public ICollection<Scholarship> Scholarship { get; set; }=new List<Scholarship>();
}