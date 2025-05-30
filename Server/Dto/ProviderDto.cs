public class ProviderDto : UserDto
{
    public override string Role => "provider";

    public string OrganizationName { get; set; } = string.Empty;
    
    public ICollection<ScholarshipDto> Scholarships { get; set; } = new List<ScholarshipDto>();
}
