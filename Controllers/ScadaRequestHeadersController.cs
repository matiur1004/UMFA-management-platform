﻿using ClientPortal.Controllers.Authorization;
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

        //POST: createOrUpdateRequestHeader
        [HttpPost("createOrUpdateScadaRequestHeaderFull")]
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

        //POST: updateRequestDetailStatus
        [HttpPost("createOrUpdateRequestHeaderTable")]
        public IActionResult UpdateRequestHeaderStatus([FromBody] ScadaRequestHeaderTable scadaRequestHeader)
        {
            try
            {
                if (scadaRequestHeader.Id == 0) // CREATE
                {
                    _logger.LogInformation($"Creating ScadaRequestHeader with Id: {scadaRequestHeader.Id}");

                    var response = _context.Database.ExecuteSqlRaw($"INSERT INTO [dbo].[ScadaRequestHeaders] " +
                        "([Status],[Active],[CreatedDTM],[StartRunDTM],[LastRunDTM],[CurrentRunDTM],[JobType],[Description],[Interval]) " + 
                        $"VALUES " +
                        $"({scadaRequestHeader.Status}, " +
                        $"{scadaRequestHeader.Active}, " +
                        $"'{scadaRequestHeader.CreatedDTM}', " +
                        $"'{scadaRequestHeader.StartRunDTM}', " +
                        $"Null, " +
                        $"Null, " +
                        $"{scadaRequestHeader.JobType}, " +
                        $"'{scadaRequestHeader.Description}', " +
                        $"{scadaRequestHeader.Interval})");

                    if (response != 0)
                    {
                        _logger.LogInformation($"Successfully Created ScadaRequestHeader: {scadaRequestHeader.Id}");
                        return Ok("{\"Data\": { \"Code\": 1, \"Message\": \"Success\"}}");
                    }
                    else throw new Exception($"Failed to Create ScadaRequestHeader With Id: {scadaRequestHeader.Id}");
                }
                else                           // UPDATE
                {
                    _logger.LogInformation($"Updating ScadaRequestHeader with Id: {scadaRequestHeader.Id}");
                    var scadaRequestHeaderEntity = _context.ScadaRequestHeaders.Find(scadaRequestHeader.Id);
                    var sql = $"UPDATE [dbo].[ScadaRequestHeaders] " +
                        $"SET [Status] = {scadaRequestHeader.Status}, " +
                        $"[Active] = {scadaRequestHeader.Active}, " +
                        $"[CreatedDTM] = '{scadaRequestHeader.CreatedDTM}', " +
                        $"[StartRunDTM] = '{scadaRequestHeader.StartRunDTM}', ";
                    if(scadaRequestHeaderEntity.LastRunDTM != null) { 
                        sql += $"[LastRunDTM] = '{scadaRequestHeaderEntity.LastRunDTM}', "; }
                    else { 
                        sql+= $"[LastRunDTM] = Null, "; }
                    if (scadaRequestHeaderEntity.CurrentRunDTM != null) { 
                        sql += $"[CurrentRunDTM] = '{scadaRequestHeaderEntity.CurrentRunDTM}', "; }
                    else { 
                        sql += $"[CurrentRunDTM] = Null, "; }
                    sql+= $"[JobType] = {scadaRequestHeader.JobType}, " +
                        $"[Description] = '{scadaRequestHeader.Description}', " +
                        $"[Interval] = {scadaRequestHeader.Interval} " +
                        $"WHERE [Id] = {scadaRequestHeader.Id}"; 

                    var response = _context.Database.ExecuteSqlRaw(sql);
                    if (response != 0)
                    {
                        _logger.LogInformation($"Successfully Updated ScadaRequestHeader: {scadaRequestHeader.Id}");
                        return Ok("{\"Data\": { \"Code\": 1, \"Message\": \"Success\"}}");
                    }
                    else throw new Exception($"Failed to Update ScadaRequestHeader With Id: {scadaRequestHeader.Id}");
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to Create Or Update ScadaRequestHeader: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to Create Or Update ScadaRequestHeader: {ex.Message}"));
            }
        }

        //POST: updateRequestHeaderStatus
        [HttpPost("updateRequestHeaderStatus/{scadaRequestHeaderId}")]
        public IActionResult UpdateRequestHeaderStatus(int scadaRequestHeaderId)
        {
            try
            {
                _logger.LogInformation($"update ScadaRequestHeader with Id: {scadaRequestHeaderId}");
                var response = _context.Database.ExecuteSqlRaw($"UPDATE [dbo].[ScadaRequestHeaders] SET " +
                    $"[Status] = {1} " +
                    $"WHERE [Id] = {scadaRequestHeaderId}");

                if (response != 0)
                {
                    _logger.LogInformation($"Successfully updated ScadaRequestHeader: {scadaRequestHeaderId}");
                    return Ok("Success");
                }
                else throw new Exception($"Failed to ScadaRequestHeader With Id: {scadaRequestHeaderId}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update ScadaRequestHeader: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update ScadaRequestHeader: {ex.Message}"));
            }
        }

        // GET: getScadaRequestHeaderStatus/5
        [HttpGet("getScadaRequestHeaderStatus/{id}")]
        public async Task<ActionResult<int>> GetScadaRequestHeaderStatus(int id)
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
            _logger.LogInformation($"ScadaRequestHeader with Id: {id} Status: {scadaRequestHeader.Status} Found and Returned!");
            return scadaRequestHeader.Status;
        }

        // GET: getScadaRequestHeaderJobType/5
        [HttpGet("getScadaRequestHeaderJobType/{id}")]
        public async Task<ActionResult<int>> GetScadaRequestHeaderJobType(int id)
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
            _logger.LogInformation($"ScadaRequestHeader with Id: {id} JobType: {scadaRequestHeader.JobType} Found and Returned!");
            return scadaRequestHeader.JobType;
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
