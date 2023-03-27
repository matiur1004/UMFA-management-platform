using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Migrations;
using ClientPortal.Models.ScadaRequestsForTableUpdate;
using DevExpress.Charts.Native;
using MimeKit;

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

        // GET: getScadaRequestDetailByHeaderId/5
        [HttpGet("getScadaRequestDetailByHeaderId/{headerId}")]
        public async Task<List<ScadaRequestDetail>> GetScadaRequestDetailByHeaderId(int headerId)
        {
            if (_context.ScadaRequestDetails == null)
            {
                _logger.LogError($"ScadaRequestDetails Entries Not Found in Table!");
                return new List<ScadaRequestDetail> { };
            }
            var scadaRequestDetail = await _context.ScadaRequestDetails.Where(n => n.HeaderId == headerId).ToListAsync();

            if (scadaRequestDetail == null)
            {
                _logger.LogError($"ScadaRequestDetails with Id: {headerId} Not Found!");
                return new List<ScadaRequestDetail> { };
            }
            _logger.LogInformation($"ScadaRequestDetails with Id: {headerId} Found and Returned!");
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

        //POST: updateRequestDetailStatus
        [HttpPost("createOrUpdateRequestDetailTable")]
        public IActionResult UpdateRequestDetailStatus([FromBody] ScadaRequestDetailTable scadaRequestDetail)
        {
            try
            {
                if (scadaRequestDetail.Id == 0)
                {
                    _logger.LogInformation($"Creating ScadaRequestDetail with Id: {scadaRequestDetail.Id}");

                    var response = _context.Database.ExecuteSqlRaw($"INSERT INTO [dbo].[ScadaRequestDetails] " +
                        $"([HeaderId],[AmrMeterId],[AmrScadaUserId],[Status],[Active],[LastRunDTM],[CurrentRunDTM],[UpdateFrequency],[LastDataDate]) " +
                        $"VALUES " +
                        $"({scadaRequestDetail.HeaderId}, " +
                        $"{scadaRequestDetail.AmrMeterId}, " +
                        $"{scadaRequestDetail.AmrScadaUserId}, " +
                        $"{scadaRequestDetail.Status}, " +
                        $"{scadaRequestDetail.Active}, " +
                        $"{scadaRequestDetail.LastRunDTM}, " +
                        $"{scadaRequestDetail.CurrentRunDTM}, " +
                        $"{scadaRequestDetail.UpdateFrequency}, " +
                        $"{scadaRequestDetail.LastDataDate})");

                    if (response != 0)
                    {
                        _logger.LogInformation($"Successfully Created ScadaRequestDetail: {scadaRequestDetail.Id}");
                        return Ok(response);
                    }
                    else throw new Exception($"Failed to Create ScadaRequestDetail With Id: {scadaRequestDetail.Id}");
                }
                else
                {
                    _logger.LogInformation($"Updating ScadaRequestDetail with Id: {scadaRequestDetail.Id}");
                    var response = _context.Database.ExecuteSqlRaw($"UPDATE [dbo].[ScadaRequestDetails] " +
                        $"SET [HeaderId] = {scadaRequestDetail.HeaderId}, " +
                        $"[AmrMeterId] = {scadaRequestDetail.AmrMeterId}, " +
                        $"[AmrScadaUserId] = {scadaRequestDetail.AmrScadaUserId}, " +
                        $"[Status] = {scadaRequestDetail.Status}, " +
                        $"[Active] = {scadaRequestDetail.Active}, " +
                        $"[LastRunDTM] = {scadaRequestDetail.LastRunDTM}, " +
                        $"[CurrentRunDTM] = {scadaRequestDetail.CurrentRunDTM}, " +
                        $"[UpdateFrequency] = {scadaRequestDetail.UpdateFrequency}, " +
                        $"[LastDataDate] = {scadaRequestDetail.LastDataDate} " +
                        $"WHERE [Id] = {scadaRequestDetail.Id}");

                    if (response != 0)
                    {
                        _logger.LogInformation($"Successfully Updated ScadaRequestDetail: {scadaRequestDetail.Id}");
                        return Ok(response);
                    }
                    else throw new Exception($"Failed to Update ScadaRequestDetail With Id: {scadaRequestDetail.Id}");
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to Create Or Update ScadaRequestDetail: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to Create Or Update ScadaRequestDetail: {ex.Message}"));
            }
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

        //POST: updateRequestDetailStatus
        [HttpPost("updateRequestDetailStatus/{scadaRequestDetailId}")]
        public IActionResult UpdateRequestDetailStatus(int scadaRequestId)
        {
            try
            {
                _logger.LogInformation($"update ScadaRequestDetail with Id: {scadaRequestId}");
                var response = _context.Database.ExecuteSqlRaw($"UPDATE [dbo].[ScadaRequestDetails] SET " +
                    $"[Status] = {0} " +
                    $"WHERE [Id] = {scadaRequestId}");

                if (response != 0)
                {
                    _logger.LogInformation($"Successfully updated ScadaRequestDetail: {scadaRequestId}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to ScadaRequestDetail With Id: {scadaRequestId}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update ScadaRequestDetail: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update ScadaRequestDetail: {ex.Message}"));
            }
        }

        // GET: getScadaRequestDetailStatus/5
        [HttpGet("getScadaRequestDetailStatus/{id}")]
        public async Task<ActionResult<int>> GetScadaRequestDetailStatus(int id)
        {
            if (_context.ScadaRequestDetails == null)
            {
                _logger.LogError($"ScadaRequestDetails Entries Not Found in Table!");
                return NotFound();
            }
            var scadaRequestDetail = await _context.ScadaRequestDetails.FindAsync(id);

            if (scadaRequestDetail == null)
            {
                _logger.LogError($"ScadaRequestDetail with Id: {id} Not Found!");
                return NotFound();
            }
            _logger.LogInformation($"ScadaRequestDetail with Id: {id} Status: {scadaRequestDetail.Status} Found and Returned!");
            return scadaRequestDetail.Status;
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
