namespace Server.Entities;

public class Scholarship
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required  string ApplyLink { get; set; }
    public bool IsAvailable { get; set; }
     public  string? ImageFile { get; set; }
    
    public int ProviderId { get; set; }
    public Provider Provider { get; set; }=null!;
   public ICollection<Application> Application { get; set; }=new List<Application>();
   public ICollection<ScholarshipAward> ScholarshipAward { get; set; }=new List<ScholarshipAward>();
   public ICollection<Feedback> Feedback { get;}=new List<Feedback>();
   public int ScholarshipCategoryId { get; set; }
    public ScholarshipCategory ScholarshipCategory { get; set; }=null!;
    public int ScholarshipTypeId { get; set; }
    public ScholarshipType ScholarshipType { get; set; }=null!;
}