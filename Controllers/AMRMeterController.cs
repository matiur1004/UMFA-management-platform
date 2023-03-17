using Microsoft.AspNetCore.Cors;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AMRMeterController : ControllerBase
    {
        private readonly ILogger<AMRMeterController> _logger;
        private readonly IAMRMeterService _amrService;

        public AMRMeterController(ILogger<AMRMeterController> logger, IAMRMeterService amrService)
        {
            _logger = logger;
            _amrService = amrService;
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
                    _logger.LogInformation($"Succesfully added new meter: {response.Id}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to add meter: {meterReq.Meter.MeterNo}");
            }
            catch(Exception ex)
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
                    _logger.LogInformation($"Succesfully got meter: {response.Id}");
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
                    _logger.LogInformation(1, $"Succesfully got meters for user: {userId}");
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
                    _logger.LogInformation(1, $"Succesfully got meters for user: {userId} and chart: {chartId}");
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
        public IActionResult Update(AMRMeterUpdateRequest request) {
            try
            {
                _logger.LogInformation($"update meter with number: {request.Meter.MeterNo}");
                var response = _amrService.EditMeterAsync(request).Result;
                if (response != null)
                {
                    _logger.LogInformation($"Succesfully updated meter: {response.Id}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to update meter: {request.Meter.MeterNo}");
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
                    _logger.LogInformation("Succesfully got makes and models");
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
    }
}
