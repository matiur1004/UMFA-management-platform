using AutoMapper;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.RequestModels;
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
        private readonly IScadaRequestService _requestService;

        public ScadaRequestDetailsController(PortalDBContext context, IAMRMeterService meterService, ILogger<ScadaRequestDetailsController> logger, IMapper mapper, IScadaRequestService requestService)
        {
            _context = context;
            _logger = logger;
            _meterService = meterService;
            _mapper = mapper;
            _requestService = requestService;
        }

        // GET: ScadaRequestDetails
        [HttpGet("getScadaRequestDetails")]
        public async Task<ActionResult<IEnumerable<ScadaRequestDetail>>> GetScadaRequestDetails()
        {
            var result = _requestService.GetScadaRequestDetailsAsync();
            if (result == null)
            {
                return Problem();
            }

            return await result;
        }

        // GET: getScadaRequestDetail/5
        [HttpGet("getScadaRequestDetail/{id}")]
        public async Task<ActionResult<ScadaRequestDetail>> GetScadaRequestDetail(int id)
        {
            var result = await _requestService.GetScadaRequestDetailAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            return result;
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
        public async Task<IActionResult> PutScadaRequestDetail(int id, ScadaRequestDetailUpdateRequest scadaRequestDetail)
        {
            if (id != scadaRequestDetail.Id)
            {
                _logger.LogError($"ScadaRequestDetail Id: {id} Not Same as Data! Cannot Update!");
                return BadRequest();
            }

            var result = await _requestService.UpdateScadaRequestDetailAsync(scadaRequestDetail);

            if (result == null)
            {
                return BadRequest();
            }

            return NoContent();
        }

        // POST: ScadaRequestDetails
        [HttpPost("addScadaRequestDetail")]
        public async Task<ActionResult<ScadaRequestDetail>> PostScadaRequestDetail(ScadaRequestDetailRequest scadaRequestDetail)
        {
            var result = await _requestService.AddScadaRequestDetailAsync(scadaRequestDetail);

            if (result == null)
            {
                return BadRequest("Could add scadaRequestDetail");
            }

            return CreatedAtAction("GetScadaRequestDetail", new { id = result.Id }, result);
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
            var result = await _requestService.RemoveScadaRequestDetailAsync(id);

            if (result == null)
            {
                return BadRequest("Could not delete Scada Request Detail");
            }

            return NoContent();
        }

        // GET: getAmrMetersForBuilding/5
        [HttpGet("getAmrMetersForBuilding/{buildingId}")]
        public async Task<List<AMRMeterList>> GetAmrMetersForBuilding(int buildingId)
        {
            var amrMeters = await _context.AMRMeterList.FromSqlRaw($"SELECT Id, MeterNo, Description FROM AMRMeters WHERE  (BuildingId = {buildingId})").ToListAsync();
            return amrMeters;
        }

        //POST: updateRequestDetailStatus
        [HttpPost("AddScadaRequestDetailItem")]
        public IActionResult AddRequestDetail([FromBody] ScadaRequestDetailItem model)
        {
            var defInt = 1;

            if (!int.TryParse(model.HeaderId.ToString(), out int hdrId)) return BadRequest(new ApplicationException($"Invalid HeaderId: '{model.HeaderId}'"));
            if (!int.TryParse(model.AmrMeterId.ToString(), out int mtrId)) return BadRequest(new ApplicationException($"Invalid AmrMeterId: '{model.AmrMeterId}'"));
            if (!int.TryParse(model.UpdateFrequency.ToString(), out int updFrq)) return BadRequest(new ApplicationException($"Invalid UpdateFrequency: '{model.UpdateFrequency}'"));
            if (updFrq == 0) { updFrq = 720; };

            try
            {
                var sql = "INSERT INTO [dbo].[ScadaRequestDetails] " +
                    "([HeaderId],[AmrMeterId],[AmrScadaUserId],[Status],[Active],[LastRunDTM],[CurrentRunDTM],[UpdateFrequency],[LastDataDate]) " +
                    "VALUES " +
                    $"({hdrId}, " +
                    $"{mtrId}, " +
                    $"{defInt}, " +
                    $"{defInt}, " +
                    $"{defInt}, " +
                    $"null, " +
                    $"null, " +
                    $"{updFrq}," +
                    $"'{model.LastDataDate}')";

                var response = _context.Database.ExecuteSqlRaw(sql);

                if (response != 0)
                {
                    _logger.LogInformation($"Successfully Created ScadaRequestDetail for HeaderId: {hdrId}");
                    return Ok("{\"Data\": { \"Code\": 1, \"Message\": \"Success\"}}");
                }
                else throw new Exception($"Failed to Create ScadaRequestDetail for HeaderId: {hdrId}");

            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to Create Or Update ScadaRequestDetail: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to Create Or Update ScadaRequestDetail: {ex.Message}"));
            }
        }

        private bool ScadaRequestDetailExists(int id)
        {
            return (_context.ScadaRequestDetails?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
