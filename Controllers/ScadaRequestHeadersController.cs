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
    [Route("[controller]")]
    [ApiController]
    public class ScadaRequestHeadersController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public ScadaRequestHeadersController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: getScadaRequestHeaders
        [HttpGet("getScadaRequestHeaders")]
        public async Task<ActionResult<IEnumerable<ScadaRequestHeader>>> GetScadaRequestHeaders()
        {
          if (_context.ScadaRequestHeaders == null)
          {
              return NotFound();
          }
            return await _context.ScadaRequestHeaders.ToListAsync();
        }

        // GET: getScadaRequestHeader/5
        [HttpGet("getScadaRequestHeader/{id}")]
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

        // PUT: updateScadaRequestHeader/5
        [HttpPut("updateScadaRequestHeader/{id}")]
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

        // POST: addScadaRequestHeaders
        [HttpPost("addScadaRequestHeader")]
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

        // DELETE: deleteScadaRequestHeader/5
        [HttpDelete("deleteScadaRequestHeader/{id}")]
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
