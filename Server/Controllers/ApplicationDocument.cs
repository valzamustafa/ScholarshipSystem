using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationDocumentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationDocumentController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationDocument>>> GetAll()
        {
            return await _context.ApplicationDocument
                .Include(doc => doc.Application)
                .ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationDocument>> GetById(int id)
        {
            var document = await _context.ApplicationDocument
                .Include(doc => doc.Application)
                .FirstOrDefaultAsync(doc => doc.Id == id);

            if (document == null)
                return NotFound();

            return document;
        }

        
        [HttpPost]
        public async Task<ActionResult<ApplicationDocument>> Create(ApplicationDocument document)
        {
           
            var applicationExists = await _context.Application.AnyAsync(a => a.Id == document.ApplicationId);
            if (!applicationExists)
                return BadRequest("ApplicationId nuk ekziston.");

            _context.ApplicationDocument.Add(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = document.Id }, document);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ApplicationDocument updatedDocument)
        {
            if (id != updatedDocument.Id)
                return BadRequest("ID nuk përputhet.");

            var existing = await _context.ApplicationDocument.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.FileName = updatedDocument.FileName;
            existing.FilePath = updatedDocument.FilePath;
            existing.ApplicationId = updatedDocument.ApplicationId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var document = await _context.ApplicationDocument.FindAsync(id);
            if (document == null)
                return NotFound();

            _context.ApplicationDocument.Remove(document);
            await _context.SaveChangesAsync();

            return NoContent();
        }

     
        [HttpGet("application/{applicationId}")]
        public async Task<ActionResult<IEnumerable<ApplicationDocument>>> GetByApplicationId(int applicationId)
        {
            var documents = await _context.ApplicationDocument
                .Where(d => d.ApplicationId == applicationId)
                .Include(d => d.Application)
                .ToListAsync();

            return documents;
        }
    }
}
