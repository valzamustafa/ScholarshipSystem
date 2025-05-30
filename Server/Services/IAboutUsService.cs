using Server.Entities;

public interface IAboutUsService
{
    Task<List<AboutUs>> GetAllAsync();
    Task<AboutUs?> GetByIdAsync(int id);
    Task<AboutUs> CreateAsync(AboutUs aboutUs);
    Task<bool> UpdateAsync(int id, AboutUs aboutUs);
    Task<bool> DeleteAsync(int id);
}