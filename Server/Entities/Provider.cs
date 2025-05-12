namespace Server.Entities;

public class Provider : User
{
    public required string OrganizationName { get; set; }
    public required bool IsLocal { get; set; }

    public ICollection<Scholarship> Scholarship { get; set; }=new List<Scholarship>(); 
    
}
