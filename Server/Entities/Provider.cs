namespace Server.Entities;

public class Provider : User
{
    public required string OrganizationName { get; set; }

    public string? Description { get; set; }

    public ICollection<Scholarship> Scholarship { get; set; } = new List<Scholarship>(); 
      public int RoleId { get; set; }
    public Role Role { get; set; }=null!;

}
