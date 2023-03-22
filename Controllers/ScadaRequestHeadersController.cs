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
    public class ScadaRequestHeadersController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public ScadaRequestHeadersController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: api/ScadaRequestHeaders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScadaRequestHeader>>> GetScadaRequestHeaders()
        {
          if (_context.ScadaRequestHeaders == null)
          {
              return NotFound();
          }
            return await _context.ScadaRequestHeaders.ToListAsync();
        }

        // GET: api/ScadaRequestHeaders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScadaRequestHeader>> GetScadaRequestHeader(int id)
        {
          if (_context.ScadaRequestHeaders == null)
          {
              return NotFound();
          }
            var scadaRequestHeader = await _context.ScadaRequestHeaders.FindAsync(id);

            if (scadaRequestHeader == null)
            {
                return NotFound();
            }

            return scadaRequestHeader;
        }

        // PUT: api/ScadaRequestHeaders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScadaRequestHeader(int id, ScadaRequestHeader scadaRequestHeader)
        {
            if (id != scadaRequestHeader.Id)
            {
                return BadRequest();
            }

            _context.Entry(scadaRequestHeader).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScadaRequestHeaderExists(id))
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

        // POST: api/ScadaRequestHeaders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ScadaRequestHeader>> PostScadaRequestHeader(ScadaRequestHeader scadaRequestHeader)
        {
          if (_context.ScadaRequestHeaders == null)
          {
              return Problem("Entity set 'PortalDBContext.ScadaRequestHeaders'  is null.");
          }
            _context.ScadaRequestHeaders.Add(scadaRequestHeader);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScadaRequestHeader", new { id = scadaRequestHeader.Id }, scadaRequestHeader);
        }

        // DELETE: api/ScadaRequestHeaders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScadaRequestHeader(int id)
        {
            if (_context.ScadaRequestHeaders == null)
            {
                return NotFound();
            }
            var scadaRequestHeader = await _context.ScadaRequestHeaders.FindAsync(id);
            if (scadaRequestHeader == null)
            {
                return NotFound();
            }

            _context.ScadaRequestHeaders.Remove(scadaRequestHeader);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScadaRequestHeaderExists(int id)
        {
            return (_context.ScadaRequestHeaders?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
