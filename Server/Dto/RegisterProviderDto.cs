public class RegisterProviderDto
{
    [Required]
    public string FullName { get; set; }=string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }=string.Empty;
    
    public string? PhoneNumber { get; set; }
      
    public string? Description { get; set; }
         public string ConfirmPassword { get; set; } = string.Empty;
    
    [Required]
    [MinLength(9)]
    public string Password { get; set; }=string.Empty;
    
    [Required]
    public string OrganizationName { get; set; }=string.Empty;
    
}