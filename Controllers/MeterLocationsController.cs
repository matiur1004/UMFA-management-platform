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
    public class MeterLocationsController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public MeterLocationsController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: MeterLocations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MeterLocation>>> GetMeterLocations()
        {
            return await _context.MeterLocations.ToListAsync();
        }

        // GET: MeterLocations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MeterLocation>> GetMeterLocation(int id)
        {
            var meterLocation = await _context.MeterLocations.FindAsync(id);

            if (meterLocation == null)
            {
                return NotFound();
            }

            return meterLocation;
        }

        // PUT: MeterLocations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMeterLocation(int id, MeterLocation meterLocation)
        {
            if (id != meterLocation.MeterLocationId)
            {
                return BadRequest();
            }

            _context.Entry(meterLocation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeterLocationExists(id))
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

        // POST: MeterLocations
        [HttpPost]
        public async Task<ActionResult<MeterLocation>> PostMeterLocation(MeterLocation meterLocation)
        {
            _context.MeterLocations.Add(meterLocation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMeterLocation", new { id = meterLocation.MeterLocationId }, meterLocation);
        }

        // DELETE: MeterLocations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeterLocation(int id)
        {
            var meterLocation = await _context.MeterLocations.FindAsync(id);
            if (meterLocation == null)
            {
                return NotFound();
            }

            _context.MeterLocations.Remove(meterLocation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MeterLocationExists(int id)
        {
            return _context.MeterLocations.Any(e => e.MeterLocationId == id);
        }
    }
}
