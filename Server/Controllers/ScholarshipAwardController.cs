using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScholarshipAwardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScholarshipAwardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ScholarshipAward>> CreateScholarshipAward([FromBody] CreateScholarshipAwardDto dto)
        {
       
            var scholarship = await _context.Scholarship
                .Include(s => s.Provider)
                .FirstOrDefaultAsync(s => s.Id == dto.ScholarshipId);

            if (scholarship == null)
                return BadRequest("Invalid ScholarshipId");

            var award = new ScholarshipAward
            {
                ScholarshipId = dto.ScholarshipId,
                StudentId = dto.StudentId,
                AwardDate = DateTime.Parse(dto.AwardDate),
         
            };

            _context.ScholarshipAward.Add(award);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetScholarshipAward), new { id = award.Id }, award);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScholarshipAwardDto>> GetScholarshipAward(int id)
        {
            var award = await _context.ScholarshipAward
                .Include(a => a.Student)
                .Include(a => a.Scholarship)
                .Where(a => a.Id == id)
                .Select(a => new ScholarshipAwardDto
                {
                    Id = a.Id,
                    AwardDate = a.AwardDate,
                    StudentName = a.Student.FullName,
                    StudentEmail = a.Student.Email,
                    StudentPhone=a.Student.PhoneNumber,
                    ScholarshipTitle = a.Scholarship.Title,
                   
                })
                .FirstOrDefaultAsync();

            if (award == null) return NotFound();
            return Ok(award);
        }

        [HttpGet("byprovider/{providerId}")]
        public async Task<ActionResult<IEnumerable<ScholarshipAwardDto>>> GetAwardsByProvider(int providerId)
        {
            var awards = await _context.ScholarshipAward
                .Include(a => a.Student)
                .Include(a => a.Scholarship)
                .Where(a => a.Scholarship.ProviderId == providerId)
                .Select(a => new ScholarshipAwardDto
                {
                    Id = a.Id,
                    AwardDate = a.AwardDate,
                    StudentName = a.Student.FullName,
                    StudentEmail = a.Student.Email,
                       StudentPhone=a.Student.PhoneNumber,
                    ScholarshipTitle = a.Scholarship.Title,
                   
                    
                })
                .ToListAsync();

            return Ok(awards);
        }
    }
}
