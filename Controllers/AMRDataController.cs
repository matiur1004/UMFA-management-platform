using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AMRDataController : ControllerBase
    {
        private readonly ILogger<AMRDataController> _logger;
        private readonly IAMRDataService _service;

        public AMRDataController(ILogger<AMRDataController> logger, IAMRDataService service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet("getWaterProfile")]
        public IActionResult GetWaterProfile([FromQuery] WaterQueryParameters p)
        {
            try
            {
                if (!int.TryParse(p.MeterId.ToString(), out int meterId)) return BadRequest(new ApplicationException($"Invalid MeterId: '{p.MeterId}'"));
                if (!DateTime.TryParse(p.StartDate, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{p.StartDate}'"));
                if (!DateTime.TryParse(p.EndDate, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{p.EndDate}'"));
                if (!TimeOnly.TryParse(p.NightFlowStart, out TimeOnly nfsTime)) return BadRequest(new ApplicationException($"Invalid NightFlow Start: '{p.NightFlowStart}'"));
                if (!TimeOnly.TryParse(p.NightFlowEnd, out TimeOnly nfeTime)) return BadRequest(new ApplicationException($"Invalid NightFlow End: '{p.NightFlowEnd}'"));
                if (!bool.TryParse(p.ApplyNightFlow.ToString(), out bool applyNF)) return BadRequest(new ApplicationException($"Invalid ApplyNightFlow Bool: '{p.ApplyNightFlow}'"));

                AMRWaterProfileRequest request = new() { MeterId = meterId, StartDate = sDt, EndDate = eDt, NightFlowStart = nfsTime, NightFlowEnd = nfeTime, ApplyNightFlow = applyNF };

                AMRWaterProfileResponse resp = _service.GetWaterProfile(request).Result;

                return Ok(resp);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving water profile data for meter {meterId}: {Message}", p.MeterId, ex.Message);
                return BadRequest(new ApplicationException($"Error while retrieving water profile data for meter {p.MeterId}: {ex.Message}"));
            }
        }

        [HttpGet("getDemandProfile")]
        public IActionResult GetDemandProfile([FromQuery] DemandQueryParameters p)
        {
            try
            {
                if (!int.TryParse(p.MeterId.ToString(), out int meterId)) return BadRequest(new ApplicationException($"Invalid MeterId: '{p.MeterId}'"));
                if (!DateTime.TryParse(p.StartDate, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{p.StartDate}'"));
                if (!DateTime.TryParse(p.EndDate, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{p.EndDate}'"));
                if (!int.TryParse(p.TOUHeaderId.ToString(), out int touHeaderId)) return BadRequest(new ApplicationException($"Invalid TOUHeaderId: '{p.TOUHeaderId}'"));
                AMRDemandProfileRequest request = new() { MeterId = meterId, StartDate = sDt, EndDate = eDt, TOUHeaderId = touHeaderId };

                DemandProfileResponse resp = _service.GetDemandProfile(request).Result;

                return Ok(resp);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving profile data for meter {meterId}: {Message}", p.MeterId, ex.Message);
                return BadRequest(new ApplicationException($"Error while retrieving profile data for meter {p.MeterId}: {ex.Message}"));
            }
        }

        [HttpGet("getTOUHeaders")]
        public IActionResult GetTOUHeaders()
        {
            try
            {
                var res = _service.GetTouHeaders().Result;
                return Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting tou headers: {Message}", ex.Message);
                return BadRequest(new ApplicationException($"Error while getting tou headers: {ex.Message}"));
            }
        }

        [HttpGet("demand-alarms-profiles")]
        public async Task<ActionResult<AmrDemandProfileAlarmsResponse>> GetAmrDemandAlarmProfiles([FromQuery] AmrDemandProfileAlarmsSpRequest request)
        {
            try
            {
                return await _service.GetDemandProfileAlarmsAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error while getting demand alarm profiles: {e.Message}");
                return Problem("Could not retrieve demand alarm profiles");
            }
        }
    }

    public class DemandQueryParameters
    {
        [BindRequired]
        public int MeterId { get; set; }
        [BindRequired]
        public string StartDate { get; set; }
        [BindRequired]
        public string EndDate { get; set; }
        [BindRequired]
        public string TOUHeaderId { get; set; }
    }

    public class WaterQueryParameters
    {
        [BindRequired]
        public int MeterId { get; set; }
        [BindRequired]
        public string StartDate { get; set; }
        [BindRequired]
        public string EndDate { get; set; }
        [BindRequired]
        public string NightFlowStart { get; set; }
        [BindRequired]
        public string NightFlowEnd { get; set; }
        public bool ApplyNightFlow { get; set; } = false;
    }
}
