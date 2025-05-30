public class CreateProviderDto
{
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string OrganizationName { get; set; }
    public string? PhoneNumber { get; set; }
    public required string Password { get; set; }
   
    public required int RoleId { get; set; } 
}