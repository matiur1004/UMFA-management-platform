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
    public class ScadaRequestDetailsController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<ScadaRequestHeadersController> _logger;

        public ScadaRequestDetailsController(PortalDBContext context, ILogger<ScadaRequestHeadersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: ScadaRequestDetails
        [HttpGet("getScadaRequestDetails")]
        public async Task<ActionResult<IEnumerable<ScadaRequestDetail>>> GetScadaRequestDetails()
        {
          if (_context.ScadaRequestDetails == null)
          {
              return NotFound();
          }
            return await _context.ScadaRequestDetails.ToListAsync();
        }

        // GET: ScadaRequestDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScadaRequestDetail>> GetScadaRequestDetail(int id)
        {
          if (_context.ScadaRequestDetails == null)
          {
              return NotFound();
          }
            var scadaRequestDetail = await _context.ScadaRequestDetails.FindAsync(id);

            if (scadaRequestDetail == null)
            {
                return NotFound();
            }

            return scadaRequestDetail;
        }

        // PUT: ScadaRequestDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScadaRequestDetail(int id, ScadaRequestDetail scadaRequestDetail)
        {
            if (id != scadaRequestDetail.Id)
            {
                return BadRequest();
            }

            _context.Entry(scadaRequestDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScadaRequestDetailExists(id))
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

        // POST: ScadaRequestDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ScadaRequestDetail>> PostScadaRequestDetail(ScadaRequestDetail scadaRequestDetail)
        {
          if (_context.ScadaRequestDetails == null)
          {
              return Problem("Entity set 'PortalDBContext.ScadaRequestDetails'  is null.");
          }
            _context.ScadaRequestDetails.Add(scadaRequestDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScadaRequestDetail", new { id = scadaRequestDetail.Id }, scadaRequestDetail);
        }

        // DELETE: ScadaRequestDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScadaRequestDetail(int id)
        {
            if (_context.ScadaRequestDetails == null)
            {
                return NotFound();
            }
            var scadaRequestDetail = await _context.ScadaRequestDetails.FindAsync(id);
            if (scadaRequestDetail == null)
            {
                return NotFound();
            }

            _context.ScadaRequestDetails.Remove(scadaRequestDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScadaRequestDetailExists(int id)
        {
            return (_context.ScadaRequestDetails?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
