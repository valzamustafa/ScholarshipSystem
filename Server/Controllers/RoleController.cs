using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context)
        {
            _context = context;
        }

      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
           
            return await _context.Role
               
                .ToListAsync();
        }

       
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
        
            var role = await _context.Role
              
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }


        [HttpPost]
        public async Task<ActionResult<Role>> CreateRole(Role role)
        {
            _context.Role.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, role);
        }

  
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, Role role)
        {
            if (id != role.Id)
                return BadRequest();

            _context.Entry(role).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Role.FindAsync(id);
            if (role == null)
                return NotFound();

            _context.Role.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoleExists(int id)
        {
            return _context.Role.Any(r => r.Id == id);
        }
    }
}
