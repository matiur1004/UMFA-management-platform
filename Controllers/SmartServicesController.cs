using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class SmartServicesController : Controller
    {
        private readonly ILogger<SmartServicesController> _logger;
        private readonly ISmartServicesService _ssService;

        public SmartServicesController(ILogger<SmartServicesController> logger, ISmartServicesService umfaService)
        {
            _logger = logger;
            _ssService = umfaService;
        }

        [HttpGet("main/water")]
        public async Task<ActionResult<SmartServicesMainWaterSpResponse>> GetMainWater([FromQuery] SmartServicesMainWaterSpRequest request)
        {
            try
            {
                if (request.StartDate == request.EndDate)
                    request.EndDate = request.StartDate?.AddDays(1);
                return await _ssService.GetSmartServicesMainWaterAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not retrieve smart services main water data");
                return Problem(e.Message);
            }
        }

        [HttpGet("main/electricity")]
        public async Task<ActionResult<SmartServicesMainElectricitySpResponse>> GetMainElectricity([FromQuery] SmartServicesMainElectricitySpRequest request)
        {
            try
            {
                if (request.StartDate == request.EndDate)
                    request.EndDate = request.StartDate?.AddDays(1);
                return await _ssService.GetSmartServicesMainElectricityAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not retrieve smart services main electricity data");
                return Problem(e.Message);
            }
        }
    }
}
