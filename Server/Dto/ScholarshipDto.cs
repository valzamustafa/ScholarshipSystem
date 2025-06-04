public class ScholarshipDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public bool IsAvailable { get; set; }
     public string? ImageFile { get; set; } 
         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
      public DateTime? Deadline { get; set; } 
    public int? ProviderId { get; set; }
    public string ProviderName { get; set; } = string.Empty;  
     public string ProviderEmail { get; set; } = string.Empty;  
    public int ScholarshipCategoryId { get; set; }
    public string ScholarshipCategoryName { get; set; } = string.Empty; 
    public int ScholarshipTypeId { get; set; }
    public string ScholarshipTypeName { get; set; } = string.Empty; 
} 