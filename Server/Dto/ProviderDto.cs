public class ProviderDto
{
    public int Id { get; set; }
    public string OrganizationName { get; set; } = string.Empty;
    public bool IsLocal { get; set; }
    public ICollection<ScholarshipDto> Scholarships { get; set; } = new List<ScholarshipDto>(); // Mund të kthehen bursat që ofron ky provider
}
