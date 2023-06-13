using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {

        private readonly ILogger<ReportsController> _logger;
        private readonly IUmfaReportService _umfaReportService;
        public ReportsController(ILogger<ReportsController> logger, IUmfaReportService umfaReportService) 
        {
            _logger = logger;
            _umfaReportService = umfaReportService;
        }

        [HttpGet("UtilityRecoveryReport")]
        public async Task<ActionResult<UtilityRecoveryReportResponse>> Get([FromQuery] UtilityRecoveryReportRequest request)
        {
            var response = await _umfaReportService.GetUtilityRecoveryReportAsync(request);
            return response;
        }

        [HttpGet("ShopUsageVarianceReport")]
        public async Task<ActionResult<ShopUsageVarianceReportResponse>> Get([FromQuery] ShopUsageVarianceRequest request)
        {
            var response = await _umfaReportService.GetShopUsageVarianceReportAsync(request);
            return response;
        }

        [HttpGet("ShopCostVarianceReport")]
        public async Task<ActionResult<ShopCostVarianceReportResponse>> GetCostVariance([FromQuery] ShopUsageVarianceRequest request)
        {
            var response = await _umfaReportService.GetShopCostVarianceReportAsync(request);
            return response;
        }
    }
}
