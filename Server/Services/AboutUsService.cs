using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

public class AboutUsService : IAboutUsService
{
    private readonly AppDbContext _context;

    public AboutUsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AboutUs>> GetAllAsync() => await _context.AboutUs.ToListAsync();

    public async Task<AboutUs?> GetByIdAsync(int id) => await _context.AboutUs.FindAsync(id);

   public async Task<AboutUs> CreateAsync(AboutUs aboutUs)
{
    if (string.IsNullOrWhiteSpace(aboutUs.Title))
        throw new ArgumentException("Title is required");
    
    if (string.IsNullOrWhiteSpace(aboutUs.Content))
        throw new ArgumentException("Content is required");

    _context.AboutUs.Add(aboutUs);
    await _context.SaveChangesAsync();
    return aboutUs;
}
    

    public async Task<bool> UpdateAsync(int id, AboutUs updated)
    {
        var existing = await _context.AboutUs.FindAsync(id);
        if (existing == null) return false;

        existing.Title = updated.Title;
        existing.Content = updated.Content;
        existing.ImageUrl = updated.ImageUrl;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.AboutUs.FindAsync(id);
        if (existing == null) return false;

        _context.AboutUs.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}
