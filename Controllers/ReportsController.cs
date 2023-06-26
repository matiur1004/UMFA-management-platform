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
            return await _umfaReportService.GetUtilityRecoveryReportAsync(request);
        }

        [HttpGet("ShopUsageVarianceReport")]
        public async Task<ActionResult<ShopUsageVarianceReportResponse>> Get([FromQuery] ShopUsageVarianceRequest request)
        {
            return await _umfaReportService.GetShopUsageVarianceReportAsync(request);
        }

        [HttpGet("ShopCostVarianceReport")]
        public async Task<ActionResult<ShopCostVarianceReportResponse>> GetCostVariance([FromQuery] ShopUsageVarianceRequest request)
        {
            return await _umfaReportService.GetShopCostVarianceReportAsync(request);
        }

        [HttpPut("ConsumptionSummaryReport")]
        public async Task<ActionResult<ConsumptionSummaryResponse>> GetConsumptionSummary([FromBody] ConsumptionSummaryRequest request)
        {
            if(request.Shops is null || !request.Shops.Any())
            {
                request.Shops = new List<int> { 0 };
            }

            return await _umfaReportService.GetConsumptionSummaryReport(new ConsumptionSummarySpRequest(request));
        }
    }
}
