using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatisticsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatistics()
        {
            var approvedStatusId = await _context.ApplicationStatus
                .Where(s => s.StatusName == "Approved")
                .Select(s => s.Id)
                .FirstOrDefaultAsync();

            var statistics = new
            {
                Partners = await _context.Provider.CountAsync(),
                RegisteredStudents = await _context.Student.CountAsync(),
             

               
                ApprovedApplications = await _context.Application
                    .CountAsync(a => a.ApplicationStatusId == approvedStatusId),

                TotalScholarships = await _context.Scholarship.CountAsync(),
              
            };

            return Ok(statistics);
        }
    }
}
