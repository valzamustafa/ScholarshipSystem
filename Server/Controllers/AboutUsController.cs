
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting; 
using Microsoft.AspNetCore.Http; 


[ApiController]
[Route("api/aboutus")]
public class AboutUsController : ControllerBase
{
    private readonly IAboutUsService _service;
     private readonly IWebHostEnvironment _environment;
    public AboutUsController(IAboutUsService service, IWebHostEnvironment environment)
    {
        _service = service;
          _environment = environment; 
    }
    

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _service.GetByIdAsync(id);
        return item == null ? NotFound() : Ok(item);
    }

   

[Authorize(Roles = "Admin")]
[HttpPost]
public async Task<IActionResult> Create(AboutUs aboutUs)
{
    var created = await _service.CreateAsync(aboutUs);
    return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
}

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AboutUs aboutUs)
    {
        var result = await _service.UpdateAsync(id, aboutUs);
        return result ? NoContent() : NotFound();
    }
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var result = await _service.DeleteAsync(id);
    return result ? NoContent() : NotFound();
}
[HttpPost("upload")]
public async Task<IActionResult> UploadFile(IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded");

    var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);

    var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(fileStream);
    }

    var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";
    return Ok(new { url = fileUrl });
}

}
