public class UpdateScholarshipDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ApplyLink { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public int ProviderId { get; set; }
    public int ScholarshipCategoryId { get; set; }
    public int ScholarshipTypeId { get; set; }
}