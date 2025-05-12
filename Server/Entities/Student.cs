namespace Server.Entities;

public class Student:User{
    public required string SchoolOrUniversityName { get; set; }
    public required string StudyField { get; set; }


    public int StudentLevelId { get; set; }
    public StudentLevel StudentLevel { get; set; }=null!;
    
}