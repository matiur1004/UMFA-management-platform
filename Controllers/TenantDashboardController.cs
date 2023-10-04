using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class TenantDashboardController : Controller
    {
        private readonly ILogger<TenantDashboardController> _logger;
        private readonly IUmfaService _umfaService;

        public TenantDashboardController(ILogger<TenantDashboardController> logger, IUmfaService umfaReportService)
        {
            _logger = logger;
            _umfaService = umfaReportService;
        }

        [HttpGet("tenants")]
        public async Task<ActionResult<List<UmfaTenantDashboardTenant>>> Get([FromQuery] UmfaTenantDashboardTenantListRequest request)
        {
            try
            {
                return await _umfaService.GetTenantDashboardTenantsAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error getting tenant dashboard tenants {e.Message}");
                return Problem("Could not return tenants");
            }
        }
    }
}
