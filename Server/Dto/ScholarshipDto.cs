public class ScholarshipDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ApplyLink { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public int ProviderId { get; set; }
    public string ProviderName { get; set; } = string.Empty;  // Mund të shtohet për të dhënë emrin e ofruesit
    public int ScholarshipCategoryId { get; set; }
    public string ScholarshipCategoryName { get; set; } = string.Empty; // Mund të shtohet për të dhënë emrin e kategorisë
    public int ScholarshipTypeId { get; set; }
    public string ScholarshipTypeName { get; set; } = string.Empty; // Mund të shtohet për të dhënë emrin e llojit të bursës
}