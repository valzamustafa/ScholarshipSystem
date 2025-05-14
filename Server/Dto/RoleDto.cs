public class RoleDto
{
    public int Id { get; set; }
    public string Emri { get; set; } = string.Empty;
    public ICollection<UserDto> Users { get; set; } = new List<UserDto>(); // Mund të kthehen përdoruesit që kanë këtë rol
}
