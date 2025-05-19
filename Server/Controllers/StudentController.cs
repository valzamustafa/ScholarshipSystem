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
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public StudentController(AppDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Student
                .Include(s => s.StudentLevel)
                .Include(s => s.Application)
                .ToListAsync();
        }

       
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Student
                .Include(s => s.StudentLevel)
                .Include(s => s.Application)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
                return NotFound();

            return student;
        }

        
        [HttpGet("profile")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdString))
                    return Unauthorized("User id not found in token.");

                if (!int.TryParse(userIdString, out int userId))
                    return Unauthorized("Invalid user id in token.");

                var student = await _context.Student
                    .Include(s => s.StudentLevel)
                    .Include(s => s.Application)
                        .ThenInclude(a => a.Scholarship)
                    .Include(s => s.Application)
                        .ThenInclude(a => a.ApplicationStatus)
                    .FirstOrDefaultAsync(s => s.Id == userId);

                if (student == null)
                    return NotFound("Student not found.");

                var studentDto = new StudentDto
                {
                    Id = student.Id,
                    FullName = student.FullName,
                    Email = student.Email,
                    SchoolOrUniversityName = student.SchoolOrUniversityName,
                    StudyField = student.StudyField,
                    StudentLevelId = student.StudentLevelId,
                    StudentLevelName = student.StudentLevel?.Level ?? "Unknown Level",
                    ImageUrl = student.ProfilePictureUrl,

                    Applications = student.Application?.Select(a => new ApplicationDto
                    {
                        Id = a.Id,
                        ApplicationDate = a.ApplicationDate,
                        ApplicationStatusId = a.ApplicationStatusId,
                        ApplicationStatusName = a.ApplicationStatus?.StatusName ?? "Unknown Status",
                        StudentId = a.StudentId,
                        StudentName = student.FullName,
                        ScholarshipId = a.ScholarshipId,
                        ScholarshipTitle = a.Scholarship?.Title ?? "Unknown Scholarship"
                    }).ToList() ?? new List<ApplicationDto>()
                };

                return Ok(studentDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProfile: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }

     
        [HttpPost("upload-profile-picture")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nuk ka skedar të ngarkuar.");

            if (!file.ContentType.StartsWith("image/"))
                return BadRequest("Lejohen vetëm skedarë të tipit imazh.");

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest("Skedari nuk duhet të jetë më i madh se 5MB.");

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", "ProfilePictures");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null || !int.TryParse(userIdString, out int userId))
                return Unauthorized("User ID në token nuk është valid.");

            var student = await _context.Student.FindAsync(userId);

            if (student == null)
                return NotFound("Studenti nuk u gjet.");

         student.ProfilePictureUrl = $"{Request.Scheme}://{Request.Host}/Uploads/ProfilePictures/{uniqueFileName}";


            await _context.SaveChangesAsync();

            return Ok(new { url = student.ProfilePictureUrl });
        }

        
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(Student student)
        {
            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            if (id != student.Id)
                return BadRequest();

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null)
                return NotFound();

            _context.Student.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(int id)
        {
            return _context.Student.Any(e => e.Id == id);
        }
    }
}
