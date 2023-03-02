using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Controllers.Authorization;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class RegisterTypesController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public RegisterTypesController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: RegisterTypes
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<RegisterType>>> GetRegisterTypes()
        {
            return await _context.RegisterTypes.ToListAsync();
        }

        // GET: RegisterTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RegisterType>> GetRegisterType(int id)
        {
            var registerType = await _context.RegisterTypes.FindAsync(id);

            if (registerType == null)
            {
                return NotFound();
            }

            return registerType;
        }

        // PUT: RegisterTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRegisterType(int id, RegisterType registerType)
        {
            if (id != registerType.RegisterTypeId)
            {
                return BadRequest();
            }

            _context.Entry(registerType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegisterTypeExists(id))
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

        // POST: RegisterTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RegisterType>> PostRegisterType(RegisterType registerType)
        {
            _context.RegisterTypes.Add(registerType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRegisterType", new { id = registerType.RegisterTypeId }, registerType);
        }

        // DELETE: RegisterTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegisterType(int id)
        {
            var registerType = await _context.RegisterTypes.FindAsync(id);
            if (registerType == null)
            {
                return NotFound();
            }

            _context.RegisterTypes.Remove(registerType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RegisterTypeExists(int id)
        {
            return _context.RegisterTypes.Any(e => e.RegisterTypeId == id);
        }
    }
}
