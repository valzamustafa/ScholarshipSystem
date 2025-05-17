public class RoleDto
{
    public int Id { get; set; }
    public string Emri { get; set; } = string.Empty;

    public ICollection<StudentDto> Students { get; set; } = new List<StudentDto>();
    public ICollection<ProviderDto> Providers { get; set; } = new List<ProviderDto>();
}