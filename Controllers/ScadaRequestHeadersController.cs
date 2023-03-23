using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ResponseModels;

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

        //POST: createOrUpdateRequestHeader
        [HttpPost("createOrUpdateScadaRequestHeader")]
        public async Task<ActionResult<ScadaRequestHeader>> CreateOrUpdateScadaRequestHeader(ScadaRequestHeader scadaRequestHeader)
        {
            if (scadaRequestHeader.Id == 0) //Create
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
            else                            //Update 
            {
                _context.Entry(scadaRequestHeader).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ScadaRequestHeaderExists(scadaRequestHeader.Id))
                    {
                        _logger.LogError($"ScadaRequestHeader with Id: {scadaRequestHeader.Id} Not Found!");
                        return NotFound();
                    }
                    else
                    {
                        _logger.LogError($"ScadaRequestHeader with Id: {scadaRequestHeader.Id} Could Not Be Updated!");
                        return Problem($"ScadaRequestHeader with Id: {scadaRequestHeader.Id} Could Not Be Updated!");
                    }
                }
                return NoContent();
            }
        }

        //POST: updateRequestHeaderStatus
        [HttpPost("updateRequestHeaderStatus")]
        public IActionResult UpdateRequestHeaderStatus([FromBody] ScadaRequestHeader scadaRequestHeader)
        {
            try
            {
                _logger.LogInformation($"update ScadaRequestHeader with Id: {scadaRequestHeader.Id}");
                var response = _context.Database.ExecuteSqlRaw($"UPDATE [dbo].[ScadaRequestHeaders] SET " +
                    $"[Status] = {0}, " +
                    $" WHERE [Id] = {scadaRequestHeader.Id}");

                if (response != 0)
                {
                    _logger.LogInformation($"Successfully updated ScadaRequestHeader: {scadaRequestHeader.Id}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to ScadaRequestHeader With Id: {scadaRequestHeader.Id}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update ScadaRequestHeader: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update ScadaRequestHeader: {ex.Message}"));
            }
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
