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

      
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalStudents = await _context.Student.CountAsync();
            var totalProviders = await _context.Provider.CountAsync();
            var totalScholarships = await _context.Scholarship.CountAsync();
            var totalApplications = await _context.Application.CountAsync();

            var stats = new
            {
                TotalStudents = totalStudents,
                TotalProviders = totalProviders,
                TotalScholarships = totalScholarships,
                TotalApplications = totalApplications
            };

            return Ok(stats);
        }

        [HttpGet("provider-requests")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetPendingProviderRequests()
        {
            var unapprovedProviders = await _context.Provider
                .Where(p => !p.IsApproved)
                .ToListAsync();

            return Ok(unapprovedProviders);
        }

      
        [HttpGet("providers")]
        public async Task<ActionResult<IEnumerable<Provider>>> GetAllProviders()
        {
            var providers = await _context.Provider.ToListAsync();
            return Ok(providers);
        }

      
        [HttpPut("provider/{id}/approve")]
        public async Task<IActionResult> ApproveProvider(int id)
        {
            var provider = await _context.Provider.FindAsync(id);
            if (provider == null)
                return NotFound();

            provider.IsApproved = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpGet("students")]
        public async Task<ActionResult<IEnumerable<Student>>> GetAllStudents()
        {
            var students = await _context.Student.ToListAsync();
            return Ok(students);
        }

        
    }
}
