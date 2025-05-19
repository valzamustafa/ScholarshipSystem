using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

      

      
        [HttpGet("provider-requests")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetPendingProviderRequests()
        {
            var unapprovedProviders = await _context.Provider
                .Where(p => !p.IsApproved)
                .ToListAsync();

            return Ok(unapprovedProviders);
        }
    }
}
