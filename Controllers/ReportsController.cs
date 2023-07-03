using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using System.Text.Json;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {

        private readonly ILogger<ReportsController> _logger;
        private readonly IUmfaReportService _umfaReportService;
        private readonly IQueueService _queueService;

        public ReportsController(ILogger<ReportsController> logger, IUmfaReportService umfaReportService, IQueueService queueService) 
        {
            _logger = logger;
            _umfaReportService = umfaReportService;
            _queueService = queueService;
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

        [HttpGet("ConsumptionSummaryReconReport")]
        public async Task<ActionResult<ConsumptionSummaryReconResponse>> GetConsumptionSummaryRecon([FromQuery] ConsumptionSummaryReconRequest request)
        {
            return await _umfaReportService.GetConsumptionSummaryReconReport(request);
        }

        [HttpPost("Archives")]
        public async Task<IActionResult> ArchiveReports([FromBody] List<ArchiveReportsRequest> request)
        {
            try
            {
                var message = JsonSerializer.Serialize(request);
                await _queueService.AddMessageToQueueAsync(message);
                return Accepted();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not archive reports");
                return Problem(e.Message);
            }
        }

    }
}
