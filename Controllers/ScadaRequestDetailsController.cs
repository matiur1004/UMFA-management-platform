using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ScadaRequestDetailsController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<ScadaRequestDetailsController> _logger;

        public ScadaRequestDetailsController(PortalDBContext context, ILogger<ScadaRequestDetailsController> logger)
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
                _logger.LogError("ScadaRequestDetails Not Found!");
                return NotFound();
          }
            _logger.LogInformation("ScadaRequestDetails Found!");
            return await _context.ScadaRequestDetails.ToListAsync();
        }

        // GET: getScadaRequestDetail/5
        [HttpGet("getScadaRequestDetail/{id}")]
        public async Task<ActionResult<ScadaRequestDetail>> GetScadaRequestDetail(int id)
        {
          if (_context.ScadaRequestDetails == null)
          {
                _logger.LogError($"ScadaRequestDetails Entries Not Found in Table!");
                return NotFound();
          }
            var scadaRequestDetail = await _context.ScadaRequestDetails.FindAsync(id);

            if (scadaRequestDetail == null)
            {
                _logger.LogError($"ScadaRequestDetails with Id: {id} Not Found!");
                return NotFound();
            }
            _logger.LogInformation($"ScadaRequestDetails with Id: {id} Found and Returned!");
            return scadaRequestDetail;
        }

        // PUT: ScadaRequestDetails/5
        [HttpPut("updateScadaRequestDetail/{id}")]
        public async Task<IActionResult> PutScadaRequestDetail(int id, ScadaRequestDetail scadaRequestDetail)
        {
            if (id != scadaRequestDetail.Id)
            {
                _logger.LogError($"ScadaRequestDetail Id: {id} Not Same as Data! Cannot Update!");
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
                    _logger.LogError($"ScadaRequestDetail with Id: {id} Not Found!");
                    return NotFound();
                }
                else
                {
                    _logger.LogError($"ScadaRequestDetail with Id: {id} Could Not Be Updated!");
                    return Problem($"ScadaRequestDetail with Id: {id} Could Not Be Updated!");
                }
            }

            return NoContent();
        }

        // POST: ScadaRequestDetails
        [HttpPost("addScadaRequestDetail")]
        public async Task<ActionResult<ScadaRequestDetail>> PostScadaRequestDetail(ScadaRequestDetail scadaRequestDetail)
        {
          if (_context.ScadaRequestDetails == null)
          {
                _logger.LogError($"ScadaRequestDetails Table is Not Found");
                return Problem("Entity set 'PortalDBContext.ScadaRequestDetails'  is null.");
          }
            _context.ScadaRequestDetails.Add(scadaRequestDetail);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"ScadaRequestDetail Saved Successfully!");
            return CreatedAtAction("GetScadaRequestDetail", new { id = scadaRequestDetail.Id }, scadaRequestDetail);
        }

        //POST: createOrUpdateRequestDetail
        [HttpPost("createOrUpdateScadaRequestDetail")]
        public async Task<ActionResult<ScadaRequestDetail>> CreateOrUpdateScadaRequestDetail(ScadaRequestDetail scadaRequestDetail)
        {
            if (scadaRequestDetail.Id == 0) //Create
            {
                if (_context.ScadaRequestDetails == null)
                {
                    _logger.LogError($"ScadaRequestDetails Table is Not Found");
                    return Problem("Entity set 'PortalDBContext.ScadaRequestDetails' is null.");
                }
                _context.ScadaRequestDetails.Add(scadaRequestDetail);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"ScadaRequestDetail Saved Successfully!");
                return CreatedAtAction("GetScadaRequestDetail", new { id = scadaRequestDetail.Id }, scadaRequestDetail);
            }
            else                            //Update 
            {
                _context.Entry(scadaRequestDetail).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ScadaRequestDetailExists(scadaRequestDetail.Id))
                    {
                        _logger.LogError($"ScadaRequestDetail with Id: {scadaRequestDetail.Id} Not Found!");
                        return NotFound();
                    }
                    else
                    {
                        _logger.LogError($"ScadaRequestDetail with Id: {scadaRequestDetail.Id} Could Not Be Updated!");
                        return Problem($"ScadaRequestDetail with Id: {scadaRequestDetail.Id} Could Not Be Updated!");
                    }
                }
                return NoContent();
            }
        }

        // DELETE: ScadaRequestDetails/5
        [HttpDelete("deleteScadaRequestDetail/{id}")]
        public async Task<IActionResult> DeleteScadaRequestDetail(int id)
        {
            if (_context.ScadaRequestDetails == null)
            {
                _logger.LogError($"ScadaRequestDetail with Id: {id} Not Found!");
                return NotFound();
            }
            var scadaRequestDetail = await _context.ScadaRequestDetails.FindAsync(id);
            if (scadaRequestDetail == null)
            {
                _logger.LogError($"ScadaRequestDetail with Id: {id} Not Found!");
                return NotFound();
            }
            try
            {
                _context.ScadaRequestDetails.Remove(scadaRequestDetail);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"ScadaRequestDetail with ID: {id} Deleted Successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Error Deleting ScadaRequestDetail with ID: {id}!");
                return Problem($"Error Deleting Entry ScadaRequestDetail With Id: {id} - Detail: {ex.Message}");
            }
            
            return NoContent();
        }

        private bool ScadaRequestDetailExists(int id)
        {
            return (_context.ScadaRequestDetails?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
