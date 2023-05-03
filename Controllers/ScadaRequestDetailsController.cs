using AutoMapper;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ScadaRequestsForTableUpdate;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ScadaRequestDetailsController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly IAMRMeterService _meterService;
        private readonly ILogger<ScadaRequestDetailsController> _logger;
        private readonly IMapper _mapper;

        public ScadaRequestDetailsController(PortalDBContext context, IAMRMeterService meterService, ILogger<ScadaRequestDetailsController> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _meterService = meterService;
            _mapper = mapper;
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
            _logger.LogInformation($"ScadaRequestDetails with Id: {headerId} Found!");
            //UpdateMetersInRequest
            foreach (var detailItem in scadaRequestDetail)
            {
                try
                {
                    var meter = _meterService.GetMeterAsync(detailItem.AmrMeterId).Result;
                    _logger.LogInformation($"Adding AMRMeter {meter.MeterNo} To ScadaRequestDetails with Id: {headerId}!");
                    var mappedMeter = _mapper.Map<AMRMeter>(meter);
                    detailItem.AmrMeter = mappedMeter;
                }
                catch (Exception)
                {
                    detailItem.AmrMeter = new AMRMeter();
                }
            }
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
                        $"'{scadaRequestDetail.LastRunDTM}', " +
                        $"'{scadaRequestDetail.CurrentRunDTM}', " +
                        $"{scadaRequestDetail.UpdateFrequency}, " +
                        $"'{scadaRequestDetail.LastDataDate}')");

                    if (response != 0)
                    {
                        _logger.LogInformation($"Successfully Created ScadaRequestDetail: {scadaRequestDetail.Id}");
                        return Ok("{\"Data\": { \"Code\": 1, \"Message\": \"Success\"}}");
                    }
                    else throw new Exception($"Failed to Create ScadaRequestDetail With Id: {scadaRequestDetail.Id}");
                }
                else
                {
                    _logger.LogInformation($"Updating ScadaRequestDetail with Id: {scadaRequestDetail.Id}");
                    var scadaRequestDetailEntity = _context.ScadaRequestDetails.Find(scadaRequestDetail.Id);
                    var sql = $"UPDATE [dbo].[ScadaRequestDetails] " +
                        $"SET [HeaderId] = {scadaRequestDetail.HeaderId}, " +
                        $"[AmrMeterId] = {scadaRequestDetail.AmrMeterId}, " +
                        $"[AmrScadaUserId] = {scadaRequestDetail.AmrScadaUserId}, " +
                        $"[Status] = {scadaRequestDetail.Status}, " +
                        $"[Active] = {scadaRequestDetail.Active}, " +
                        $"[LastRunDTM] = '{scadaRequestDetailEntity.LastRunDTM}', " +
                        $"[CurrentRunDTM] = '{scadaRequestDetail.CurrentRunDTM}', " +
                        $"[UpdateFrequency] = {scadaRequestDetail.UpdateFrequency}, " +
                        $"[LastDataDate] = '{scadaRequestDetail.LastDataDate}' " + 
                        $"WHERE [Id] = {scadaRequestDetail.Id}";

                    var response = _context.Database.ExecuteSqlRaw(sql);

                    if (response != 0)
                    {
                        _logger.LogInformation($"Successfully Updated ScadaRequestDetail: {scadaRequestDetail.Id}");
                        return Ok("{\"Data\": { \"Code\": 1, \"Message\": \"Success\"}}");
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
        [HttpPost("createOrUpdateScadaRequestDetailFull")]
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
        public IActionResult UpdateRequestDetailStatus(int scadaRequestDetailId)
        {
            try
            {
                _logger.LogInformation($"update ScadaRequestDetail with Id: {scadaRequestDetailId}");
                var response = _context.Database.ExecuteSqlRaw($"UPDATE [dbo].[ScadaRequestDetails] SET " +
                    $"[Status] = {1} " +
                    $"WHERE [Id] = {scadaRequestDetailId}");

                if (response != 0)
                {
                    _logger.LogInformation($"Successfully updated ScadaRequestDetail: {scadaRequestDetailId}");
                    return Ok("Success");
                }
                else throw new Exception($"Failed to ScadaRequestDetail With Id: {scadaRequestDetailId}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update ScadaRequestDetail: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update ScadaRequestDetail: {ex.Message}"));
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

        // GET: getAmrMetersForBuilding/5
        [HttpGet("getAmrMetersForBuilding/{buildingId}")]
        public async Task<ActionResult<IEnumerable<AMRMeter>>> GetAmrMetersForBuilding(int buildingId)
        {
            if (_context.AMRMeters == null)
            {
                _logger.LogError($"AMRMeters Entries Not Found in Table!");
                return NotFound();
            }
            var amrMeters = await _context.AMRMeters.Where(b => b.BuildingId == buildingId).ToListAsync(); 

            if (amrMeters == null)
            {
                _logger.LogError($"AMRMeters with BuildingId: {buildingId} Not Found!");
                return NotFound();
            }
            _logger.LogInformation($"AMRMeters with BuildingId: {buildingId} Found and Returned!");
            return amrMeters;
        }

        private bool ScadaRequestDetailExists(int id)
        {
            return (_context.ScadaRequestDetails?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
