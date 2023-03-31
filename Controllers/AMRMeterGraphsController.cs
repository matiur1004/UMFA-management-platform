using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ClientPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AMRMeterGraphsController : ControllerBase
    {
        private readonly ILogger<AMRMeterGraphsController> _logger;
        private readonly IAMRDataService _service;

        public AMRMeterGraphsController(ILogger<AMRMeterGraphsController> logger, IAMRDataService service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet("getGraphProfile")]
        public IActionResult GetGraphProfile([FromQuery] GraphQueryParameters gq)
        {
            try
            {
                if (!int.TryParse(gq.MeterId.ToString(), out int meterId)) return BadRequest(new ApplicationException($"Invalid MeterId: '{gq.MeterId}'"));
                if (!DateTime.TryParse(gq.StartDate, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{gq.StartDate}'"));
                if (!DateTime.TryParse(gq.EndDate, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{gq.EndDate}'"));
                if (!TimeOnly.TryParse(gq.NightFlowStart, out TimeOnly nfsTime)) return BadRequest(new ApplicationException($"Invalid NightFlow Start: '{gq.NightFlowStart}'"));
                if (!TimeOnly.TryParse(gq.NightFlowEnd, out TimeOnly nfeTime)) return BadRequest(new ApplicationException($"Invalid NightFlow End: '{gq.NightFlowEnd}'"));
                AMRGraphProfileRequest request = new() { MeterId = meterId, StartDate = sDt, EndDate = eDt, NightFlowStart = nfsTime, NightFlowEnd = nfeTime };

                AMRGraphProfileResponse resp = _service.GetGraphProfile(request).Result;

                return Ok(resp);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving graph profile data for meter {meterId}: {Message}", gq.MeterId, ex.Message);
                return BadRequest(new ApplicationException($"Error while retrieving graph profile data for meter {gq.MeterId}: {ex.Message}"));
            }
        }
    }
}

public class GraphQueryParameters
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
}
