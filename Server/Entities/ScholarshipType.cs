namespace Server.Entities;
public class ScholarshipType
{
    public int Id { get; set; }

    
    public required string Name { get; set; }
    public required string Description { get; set; }// %  e burses shembull 25%, 50%, 75% ose 100%

    
    public ICollection<Scholarship> Scholarship { get; set; }= new List<Scholarship>();
}