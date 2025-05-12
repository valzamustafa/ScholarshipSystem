namespace Server.Entities;

public class Provider : User
{
    public required string OrganizationName { get; set; }
    public bool IsLocal { get; set; }

    
}
