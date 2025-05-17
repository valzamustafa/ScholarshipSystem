namespace Server.Entities;


public class Admin : User
{
    
     public int RoleId { get; set; }
    public Role Role { get; set; }=null!;
}