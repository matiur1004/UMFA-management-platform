using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AMRMetersController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public AMRMetersController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: api/AMRMeters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AMRMeter>>> GetAMRMeters()
        {
          if (_context.AMRMeters == null)
          {
              return NotFound();
          }
            return await _context.AMRMeters.ToListAsync();
        }

        // GET: api/AMRMeters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AMRMeter>> GetAMRMeter(int id)
        {
          if (_context.AMRMeters == null)
          {
              return NotFound();
          }
            var aMRMeter = await _context.AMRMeters.FindAsync(id);

            if (aMRMeter == null)
            {
                return NotFound();
            }

            return aMRMeter;
        }

        // PUT: api/AMRMeters/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAMRMeter(int id, AMRMeter aMRMeter)
        {
            if (id != aMRMeter.Id)
            {
                return BadRequest();
            }

            _context.Entry(aMRMeter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AMRMeterExists(id))
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

        // POST: api/AMRMeters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AMRMeter>> PostAMRMeter(AMRMeter aMRMeter)
        {
          if (_context.AMRMeters == null)
          {
              return Problem("Entity set 'PortalDBContext.AMRMeters'  is null.");
          }
            _context.AMRMeters.Add(aMRMeter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAMRMeter", new { id = aMRMeter.Id }, aMRMeter);
        }

        // DELETE: api/AMRMeters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAMRMeter(int id)
        {
            if (_context.AMRMeters == null)
            {
                return NotFound();
            }
            var aMRMeter = await _context.AMRMeters.FindAsync(id);
            if (aMRMeter == null)
            {
                return NotFound();
            }

            _context.AMRMeters.Remove(aMRMeter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AMRMeterExists(int id)
        {
            return (_context.AMRMeters?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
