using AutoMapper;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using DevExpress.DataAccess.Native.Web;
using System.Dynamic;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AMRMeterController : ControllerBase
    {
        private readonly ILogger<AMRMeterController> _logger;
        private readonly IAMRMeterService _amrService;
        private readonly PortalDBContext _context;
        private readonly IMapper _mapper;

        public AMRMeterController(ILogger<AMRMeterController> logger, IAMRMeterService amrService, PortalDBContext portalDBContext, IMapper mapper)
        {
            _logger = logger;
            _amrService = amrService;
            _context = portalDBContext;
            _mapper = mapper;
        }

        [HttpPost("addMeter")]
        public IActionResult Create([FromBody] AMRMeterUpdateRequest meterReq)
        {
            try
            {
                _logger.LogInformation($"Add new meter to database: {meterReq.Meter.MeterNo}");
                var response = _amrService.AddMeterAsync(meterReq).Result;
                if (response != null)
                {
                    _logger.LogInformation($"Successfully added new meter: {response.Id}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to add meter: {meterReq.Meter.MeterNo}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to add new meter: {ex.Message}");
                return BadRequest(new ApplicationException(ex.Message));
            }
        }

        [HttpGet("meter/{id}")]
        public IActionResult GetMeter(int id)
        {
            try
            {
                _logger.LogInformation($"Get meter with id {id} from database");
                var response = _amrService.GetMeterAsync(id).Result;
                if (response != null)
                {
                    _logger.LogInformation($"Successfully got meter: {response.Id}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to get meter: {id}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to get meter {id}: {ex.Message}");
                return BadRequest(new ApplicationException(ex.Message));
            }
        }

        [HttpGet("userMeters/{userId}")]
        public IActionResult GetMetersForUser(int userId)
        {
            try
            {
                _logger.LogInformation(1, $"Get meters for user {userId} from database");
                var response = _amrService.GetAllMetersForUser(userId).Result;
                if (response.Message.StartsWith("Error")) throw new Exception($"Failed to get meters for user: {userId}");
                else if (response.Message == "Success")
                {
                    _logger.LogInformation(1, $"Successfully got meters for user: {userId}");
                    return Ok(response.AMRMeterResponses.ToList());
                }
                else
                {
                    return Ok(new List<AMRMeterResponse>());
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to get meters for user {User}: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to get meters for user {User}: {ex.Message}"));
            }
        }

        [HttpGet("getMetersNotScheduledForUser/{userId}/{jobTypeId}")]
        public async Task<ActionResult<IEnumerable<AMRMetersNotScheduled>>> GetMetersNotScheduledForUser(int userId, int jobTypeId)
        {
            try
            {
                _logger.LogInformation(1, $"Get meters for user {userId} with JobTypeId {jobTypeId} from database");
                var meters = await _context.AMRMetersNotScheduled.FromSqlRaw($"exec spUserMetersNotScheduled {userId}, {jobTypeId}").ToListAsync();

                if (meters != null)
                {
                    _logger.LogInformation(1, $"Successfully got meters for user: {userId}");
                    return Ok(meters.ToList());
                }
                else
                {
                    return Ok(new List<AMRMetersNotScheduled>());
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to get meters for user {User}: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to get meters for user {User}: {ex.Message}"));
            }
        }

        [HttpGet("getAMRMetersWithAlarms/{buildingId}")]
        public ActionResult<IEnumerable<dynamic>> GetAMRMetersWithAlarms(int buildingId)
        {
            List<dynamic> resultList = new List<dynamic>();
            _logger.LogInformation(1, $"Get meter alarms for building id: {buildingId} from database");
            try
            {
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "spGetAMRMeterAlarms";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "@BuildingId";
                    parameter.Value = buildingId;
                    command.Parameters.Add(parameter);

                    _context.Database.OpenConnection();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dynamic result = new ExpandoObject();
                            var dictionary = result as IDictionary<string, object>;

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                            }
                            resultList.Add(result);
                        }
                    }
                }
            }
            catch (Exception)
            {
                _logger?.LogError($"Failed to get meters for BuildingId {buildingId}");
                return Problem($"Failed to get meters with alarms for BuildingId {buildingId}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, $"Returning meters with alarms for building: {buildingId}");
            }
            else
            {
                _logger.LogError(1, $"No Results Found For Meters with alarms for building: {buildingId}");
            }

            return Ok(resultList);
        }

        [HttpGet("userMetersChart/{userId}/{chartId}")]
        public IActionResult GetMetersForUserChart(int userId, int chartId)
        {
            try
            {
                _logger.LogInformation(1, $"Get meters for user {userId} from database");
                var response = _amrService.GetAllMetersForUserChart(userId, chartId).Result;
                if (response.Message.StartsWith("Error")) throw new Exception($"Failed to get meters for user: {userId} and chart: {chartId}");
                else if (response.Message == "Success")
                {
                    _logger.LogInformation(1, $"Successfully got meters for user: {userId} and chart: {chartId}");
                    return Ok(response.AMRMeterResponses.ToList());
                }
                else
                {
                    return Ok(new List<AMRMeterResponse>());
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to get meters for user {userId} and chart {chartId}: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to get meters for user {userId} and chart {chartId}: {ex.Message}"));
            }
        }

        [HttpPut("updateMeter")]
        public IActionResult Update(AMRMeterUpdateRequest request)
        {
            try
            {
                _logger.LogInformation($"update meter with number: {request.Meter.MeterNo}");
                var updMeter = _mapper.Map<AMRMeter>(request);
                updMeter.UserId = request.UserId;
                _context.Entry(updMeter).State = EntityState.Modified;

                try
                {
                    _context.AMRMeters.Update(updMeter);
                    _context.SaveChangesAsync();
                    return Ok(updMeter);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AMRMeterExists(request.Meter.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                //var response = _amrService.EditMeterAsync(request).Result;
                //if (response != null)
                //{
                //    _logger.LogInformation($"Successfully updated meter: {response.Id}");
                //    return Ok(response);
                //}
                //else throw new Exception($"Failed to update meter: {request.Meter.MeterNo}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update meter: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update meter: {ex.Message}"));
            }
        }

        [HttpGet("getMakeModels")]
        public IActionResult GetMakeModels()
        {
            _logger.LogInformation("Getting all active make and models");
            try
            {
                var resp = _amrService.GetMakeModels().Result;
                if (resp != null)
                {
                    _logger.LogInformation("Successfully got makes and models");
                    return Ok(resp);
                }
                else throw new Exception("Failed to get makes and models");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting all active make and models: {ex.Message}");
                //return BadRequest(new ApplicationException($"Error while getting all active make and models: {ex.Message}"));
                return BadRequest($"Error while getting all active make and models: {ex.Message}");
            }
        }
        private bool AMRMeterExists(int id)
        {
            return (_context.AMRMeters?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
