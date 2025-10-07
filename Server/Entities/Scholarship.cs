namespace Server.Entities;

public class Scholarship
{
  public int Id { get; set; }
  public DateTime? Deadline { get; set; }
  public required string Title { get; set; }
  public required string Description { get; set; }
  public string? StudyField { get; set; }
  public bool IsApproved { get; set; }
  public bool IsAvailable { get; set; }
  public string? ImageFile { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public int? ProviderId { get; set; }
  public Provider Provider { get; set; } = null!;
  public ICollection<Application> Application { get; set; } = new List<Application>();
  public ICollection<ScholarshipAward> ScholarshipAward { get; set; } = new List<ScholarshipAward>();
  public DateTime? DeadlineDate { get; set; }
  public DateTime? ExpiryDate { get; set; }
  public ICollection<Feedback> Feedback { get; } = new List<Feedback>();
  public int ScholarshipCategoryId { get; set; }
  public ScholarshipCategory ScholarshipCategory { get; set; } = null!;
  public int ScholarshipTypeId { get; set; }
  public ScholarshipType ScholarshipType { get; set; } = null!;
  
    public string? University { get; set; }
    public string? AcademicYear { get; set; }
    public string? EligibilityCriteria { get; set; }

   

 
}