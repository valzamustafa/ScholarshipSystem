public class UpdateProviderDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string OrganizationName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public bool IsLocal { get; set; }
    public int RoleId { get; set; } 
}