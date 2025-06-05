public class ResetPasswordDto
{
    public string ResetToken { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
    public string ConfirmPassword { get; set; } = null!;
}