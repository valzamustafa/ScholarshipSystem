using Microsoft.AspNetCore.Identity;

public interface IPasswordVerificationService<TUser>
    where TUser : class
{
    bool VerifyPassword(TUser user, string hashedPassword, string providedPassword);
}

public class PasswordVerificationService<TUser> : IPasswordVerificationService<TUser>
    where TUser : class
{
    private readonly IPasswordHasher<TUser> _passwordHasher;

    public PasswordVerificationService(IPasswordHasher<TUser> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public bool VerifyPassword(TUser user, string hashedPassword, string providedPassword)
{
    if (string.IsNullOrEmpty(hashedPassword) || string.IsNullOrEmpty(providedPassword))
        return false;

    try
    {
        var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
    catch (FormatException)
    {
       
        return false;
    }
    catch (Exception)
    {
       
        return false;
    }
}

}
