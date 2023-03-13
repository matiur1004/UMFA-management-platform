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
    public class SupplyTypesController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public SupplyTypesController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: SupplyTypes
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<SupplyType>>> GetSupplyTypes()
        {
            return await _context.SupplyTypes.ToListAsync();
        }

        // GET: SupplyTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplyType>> GetSupplyType(int id)
        {
            var supplyType = await _context.SupplyTypes.FindAsync(id);

            if (supplyType == null)
            {
                return NotFound();
            }

            return supplyType;
        }

        // PUT: SupplyTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSupplyType(int id, SupplyType supplyType)
        {
            if (id != supplyType.SupplyTypeId)
            {
                return BadRequest();
            }

            _context.Entry(supplyType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplyTypeExists(id))
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

        // POST: SupplyTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SupplyType>> PostSupplyType(SupplyType supplyType)
        {
            _context.SupplyTypes.Add(supplyType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSupplyType", new { id = supplyType.SupplyTypeId }, supplyType);
        }

        // DELETE: SupplyTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplyType(int id)
        {
            var supplyType = await _context.SupplyTypes.FindAsync(id);
            if (supplyType == null)
            {
                return NotFound();
            }

            _context.SupplyTypes.Remove(supplyType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SupplyTypeExists(int id)
        {
            return _context.SupplyTypes.Any(e => e.SupplyTypeId == id);
        }
    }
}
