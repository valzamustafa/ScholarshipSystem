using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Data; 

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProviderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProviderController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Provider>>> GetProviders()
        {
            return await _context.Provider
                .Include(p => p.Scholarship)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Provider>> GetProvider(int id)
        {
            var provider = await _context.Provider
                .Include(p => p.Scholarship)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (provider == null)
                return NotFound();

            return provider;
        }

        
        [HttpPost]
        public async Task<ActionResult<Provider>> CreateProvider(Provider provider)
        {
            _context.Provider.Add(provider);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProvider), new { id = provider.Id }, provider);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProvider(int id, Provider provider)
        {
            if (id != provider.Id)
                return BadRequest();

            _context.Entry(provider).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProviderExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProvider(int id)
        {
            var provider = await _context.Provider.FindAsync(id);
            if (provider == null)
                return NotFound();

            _context.Provider.Remove(provider);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProviderExists(int id)
        {
            return _context.Provider.Any(e => e.Id == id);
        }
    }
}
