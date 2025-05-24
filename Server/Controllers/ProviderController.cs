using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


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
[HttpGet("current")]
[Authorize]
public async Task<ActionResult<Provider>> GetCurrentProvider()
{
    var email = User.FindFirstValue(ClaimTypes.Email);
    if (string.IsNullOrEmpty(email))
        return Unauthorized();

    var provider = await _context.Provider
        .FirstOrDefaultAsync(p => p.Email == email);

    if (provider == null)
        return NotFound();

    return provider;
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
public async Task<ActionResult<Provider>> CreateProvider([FromBody] CreateProviderDto providerDto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var roleExists = await _context.Role.AnyAsync(r => r.Id == providerDto.RoleId);
    if (!roleExists)
    {
        return BadRequest("Invalid role specified");
    }

    var passwordHash = BCrypt.Net.BCrypt.HashPassword(providerDto.Password);

    var provider = new Provider
    {
        FullName = providerDto.FullName,
        Email = providerDto.Email,
        OrganizationName = providerDto.OrganizationName,
        PhoneNumber = providerDto.PhoneNumber,
        PasswordHash = passwordHash,
        IsLocal = providerDto.IsLocal,
        IsApproved = true,
        RoleId = providerDto.RoleId 
    };

    _context.Provider.Add(provider);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetProvider), new { id = provider.Id }, provider);
}
       
       [HttpPut("{id}")]
public async Task<IActionResult> UpdateProvider(int id, [FromBody] UpdateProviderDto providerDto)
{
    if (id != providerDto.Id)
    {
        return BadRequest();
    }

    var provider = await _context.Provider.FindAsync(id);
    if (provider == null)
    {
        return NotFound();
    }

    provider.FullName = providerDto.FullName;
    provider.Email = providerDto.Email;
    provider.OrganizationName = providerDto.OrganizationName;
    provider.PhoneNumber = providerDto.PhoneNumber;
    provider.IsLocal = providerDto.IsLocal;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!ProviderExists(id))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
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

    
        [HttpGet("unapproved")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetUnapprovedProviders()
        {
            var unapprovedProviders = await _context.Provider
                .Where(p => !p.IsApproved)
                .ToListAsync();

            return Ok(unapprovedProviders);
        }

      
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveProvider(int id)
        {
            var provider = await _context.Provider.FindAsync(id);

            if (provider == null)
                return NotFound();

            provider.IsApproved = true;
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

        private bool ProviderExists(int id)
        {
            return _context.Provider.Any(e => e.Id == id);
        }
    }
}
