using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Entities;
using Server.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILogger<StudentController> _logger;

        public StudentController(
            AppDbContext context, 
            IWebHostEnvironment hostingEnvironment,
            ILogger<StudentController> logger)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }


        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Student>>> GetAllStudents()
        {
            _logger.LogInformation("Fetching all students");
            try
            {
                var students = await _context.Student
                    .Include(s => s.StudentLevel)
                    .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching students");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Student>> GetStudentById(int id)
        {
            _logger.LogInformation("Fetching student with ID: {StudentId}", id);
            try
            {
                var student = await _context.Student
                    .Include(s => s.StudentLevel)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (student == null)
                {
                    _logger.LogWarning("Student with ID {StudentId} not found", id);
                    return NotFound();
                }

                return student;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching student with ID: {StudentId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

     [HttpPost]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<Student>> CreateStudent([FromBody] CreateStudentDto studentDto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var passwordHash = BCrypt.Net.BCrypt.HashPassword(studentDto.Password);

    var student = new Student
    {
        FullName = studentDto.FullName,
        Email = studentDto.Email,
        SchoolOrUniversityName = studentDto.SchoolOrUniversityName,
        StudyField = studentDto.StudyField,
        StudentLevelId = studentDto.StudentLevelId,
        RoleId = studentDto.RoleId,
        PasswordHash = passwordHash, 
        IsApproved = true
    };

    _context.Student.Add(student);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetStudentById), new { id = student.Id }, student);
}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            if (id != student.Id)
            {
                _logger.LogWarning("ID mismatch in student update. Route ID: {RouteId}, Student ID: {StudentId}", id, student.Id);
                return BadRequest();
            }

            _logger.LogInformation("Updating student with ID: {StudentId}", id);
            
            try
            {
                _context.Entry(student).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully updated student with ID: {StudentId}", id);
                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!StudentExists(id))
                {
                    _logger.LogWarning("Student with ID {StudentId} not found for update", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogError(ex, "Concurrency error while updating student with ID: {StudentId}", id);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating student with ID: {StudentId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            _logger.LogInformation("Deleting student with ID: {StudentId}", id);
            
            try
            {
                var student = await _context.Student.FindAsync(id);
                if (student == null)
                {
                    _logger.LogWarning("Student with ID {StudentId} not found for deletion", id);
                    return NotFound();
                }

                _context.Student.Remove(student);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully deleted student with ID: {StudentId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting student with ID: {StudentId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

    

        [HttpGet("profile")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                _logger.LogWarning("Invalid user ID in token: {UserIdString}", userIdString);
                return Unauthorized("User ID nuk u gjet ose është invalid.");
            }

            _logger.LogInformation("Fetching profile for student with ID: {StudentId}", userId);
            
            try
            {
                var student = await _context.Student
                    .Include(s => s.StudentLevel)
                    .Include(s => s.Application)
                        .ThenInclude(a => a.Scholarship)
                    .Include(s => s.Application)
                        .ThenInclude(a => a.ApplicationStatus)
                    .FirstOrDefaultAsync(s => s.Id == userId);

                if (student == null)
                {
                    _logger.LogWarning("Student profile not found for ID: {StudentId}", userId);
                    return NotFound("Studenti nuk u gjet.");
                }

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

                _logger.LogInformation("Successfully retrieved profile for student with ID: {StudentId}", userId);
                return Ok(studentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching profile for student with ID: {StudentId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("upload-profile-picture")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Empty file uploaded for profile picture");
                return BadRequest("Nuk ka skedar të ngarkuar.");
            }

            if (!file.ContentType.StartsWith("image/"))
            {
                _logger.LogWarning("Invalid file type uploaded for profile picture: {ContentType}", file.ContentType);
                return BadRequest("Lejohen vetëm skedarë të tipit imazh.");
            }

            if (file.Length > 5 * 1024 * 1024)
            {
                _logger.LogWarning("File too large for profile picture: {FileSize} bytes", file.Length);
                return BadRequest("Skedari nuk duhet të jetë më i madh se 5MB.");
            }

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                _logger.LogWarning("Invalid user ID in token during profile picture upload: {UserIdString}", userIdString);
                return Unauthorized("User ID në token nuk është valid.");
            }

            _logger.LogInformation("Uploading profile picture for student with ID: {StudentId}", userId);
            
            try
            {
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", "ProfilePictures");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var student = await _context.Student.FindAsync(userId);
                if (student == null)
                {
                    _logger.LogWarning("Student not found during profile picture upload: {StudentId}", userId);
                    return NotFound("Studenti nuk u gjet.");
                }

                student.ProfilePictureUrl = $"{Request.Scheme}://{Request.Host}/Uploads/ProfilePictures/{uniqueFileName}";
                await _context.SaveChangesAsync();

                _logger.LogInformation("Successfully uploaded profile picture for student with ID: {StudentId}", userId);
                return Ok(new { url = student.ProfilePictureUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading profile picture for student with ID: {StudentId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        private bool StudentExists(int id)
        {
            return _context.Student.Any(e => e.Id == id);
        }
    }
}