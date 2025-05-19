namespace Server.Entities;

public class Student:User{
    public required string SchoolOrUniversityName { get; set; }
    public required string StudyField { get; set; }
public string? ProfilePictureUrl { get; set; }


    public int StudentLevelId { get; set; }
    public StudentLevel StudentLevel { get; set; }=null!;

    public ICollection<Application> Application { get; set; }=new List<Application>();

     public int RoleId { get; set; }
    public Role Role { get; set; }=null!;

    
}