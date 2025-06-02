public class ProviderDto : UserDto
{
    public override string Role => "provider";

    public string OrganizationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ScholarshipCount { get; set; }
    public int AwardedCount { get; set; }
    public ICollection<ScholarshipDto> Scholarships { get; set; } = new List<ScholarshipDto>();
       public ICollection<RecentApplicationDto> RecentApplications { get; set; } = new List<RecentApplicationDto>();
}
