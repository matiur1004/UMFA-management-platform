using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ScadaRequestHeadersController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<ScadaRequestHeadersController> _logger;

        public ScadaRequestHeadersController(PortalDBContext context, ILogger<ScadaRequestHeadersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: getScadaRequestHeaders
        [HttpGet("getScadaRequestHeaders")]
        public async Task<ActionResult<IEnumerable<ScadaRequestHeader>>> GetScadaRequestHeaders()
        {
          if (_context.ScadaRequestHeaders == null)
          {
              _logger.LogError("ScadaRequestHeaders Not Found!");
              return NotFound();
          }
            _logger.LogInformation("ScadaRequestHeaders Found!");
            return await _context.ScadaRequestHeaders.ToListAsync();
        }

        // GET: getScadaRequestHeader/5
        [HttpGet("getScadaRequestHeader/{id}")]
        public async Task<ActionResult<ScadaRequestHeader>> GetScadaRequestHeader(int id)
        {
          if (_context.ScadaRequestHeaders == null)
          {
                _logger.LogError($"ScadaRequestHeaders Entries Not Found in Table!");
                return NotFound();
          }
            var scadaRequestHeader = await _context.ScadaRequestHeaders.FindAsync(id);

            if (scadaRequestHeader == null)
            {
                _logger.LogError($"ScadaRequestHeader with Id: {id} Not Found!");
                return NotFound();
            }
            _logger.LogInformation($"ScadaRequestHeader with Id: {id} Found and Returned!");
            return scadaRequestHeader;
        }

        // PUT: updateScadaRequestHeader/5
        [HttpPut("updateScadaRequestHeader/{id}")]
        public async Task<IActionResult> PutScadaRequestHeader(int id, ScadaRequestHeader scadaRequestHeader)
        {
            if (id != scadaRequestHeader.Id)
            {
                _logger.LogError($"ScadaRequestHeader Id: {id} Not Same as Data! Cannot Update!");
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
                    _logger.LogError($"ScadaRequestHeader with Id: {id} Not Found!");
                    return NotFound();
                }
                else
                {
                    _logger.LogError($"ScadaRequestHeader with Id: {id} Could Not Be Updated!");
                    return Problem($"ScadaRequestHeader with Id: {id} Could Not Be Updated!");
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
                _logger.LogError($"ScadaRequestHeaders Table is Not Found");
                return Problem("Entity set 'PortalDBContext.ScadaRequestHeaders' is null.");
          }
            _context.ScadaRequestHeaders.Add(scadaRequestHeader);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"ScadaRequestHeader Saved Successfully!");
            return CreatedAtAction("GetScadaRequestHeader", new { id = scadaRequestHeader.Id }, scadaRequestHeader);
        }

        // DELETE: deleteScadaRequestHeader/5
        [HttpDelete("deleteScadaRequestHeader/{id}")]
        public async Task<IActionResult> DeleteScadaRequestHeader(int id)
        {
            if (_context.ScadaRequestHeaders == null)
            {
                _logger.LogError($"ScadaRequestHeader with Id: {id} Not Found!");
                return NotFound();
            }
            var scadaRequestHeader = await _context.ScadaRequestHeaders.FindAsync(id);
            if (scadaRequestHeader == null)
            {
                _logger.LogError($"ScadaRequestHeader with Id: {id} Not Found!");
                return NotFound();
            }
            try
            {
                _context.ScadaRequestHeaders.Remove(scadaRequestHeader);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"ScadaRequestHeader with ID: {id} Deleted Successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error Deleting ScadaRequestHeader with ID: {id}!");
                return Problem($"Error Deleting Entry ScadaRequestHeader With Id: {id} - Detail: {ex.Message}");
            }
            return NoContent();
        }

        private bool ScadaRequestHeaderExists(int id)
        {
            return (_context.ScadaRequestHeaders?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
