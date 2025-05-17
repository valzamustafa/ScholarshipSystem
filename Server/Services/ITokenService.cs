using Server.Entities;

namespace Server.Services
{
    public interface ITokenService
    {
        string GenerateToken(Student student);
        string GenerateToken(Provider provider);
        string GenerateToken(Admin admin);
    }
}
