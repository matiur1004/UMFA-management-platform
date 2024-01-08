using ClientPortal.Controllers.Authorization;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {

        private readonly ILogger<ReportsController> _logger;
        private readonly IUmfaService _umfaService;
        private readonly IArchivesQueueService _queueService;
        private readonly IArchivesService _archivesService;
        private readonly IReportsService _reportsService;
        private readonly IFeedbackReportsQueueService _feedbackReportsQueueService;
        private readonly IClientFeedbackReportQueueService _clientFeedbackReportQueueService;

        public ReportsController(ILogger<ReportsController> logger, IUmfaService umfaReportService, IArchivesQueueService queueService, IArchivesService archivesServices, IReportsService reportsService, IFeedbackReportsQueueService feedbackReportsQueueService, IClientFeedbackReportQueueService clientFeedbackReportQueueService) 
        {
            _logger = logger;
            _umfaService = umfaReportService;
            _queueService = queueService;
            _archivesService = archivesServices;
            _reportsService = reportsService;
            _feedbackReportsQueueService = feedbackReportsQueueService;
            _clientFeedbackReportQueueService = clientFeedbackReportQueueService;
        }

        [HttpGet("UtilityRecoveryReport")]
        public async Task<ActionResult<UtilityRecoveryReportResponse>> Get([FromQuery] UtilityRecoveryReportRequest request)
        {
            UtilityRecoveryReportResponse ret = null;
            try
            {
                ret = await _umfaService.GetUtilityRecoveryReportAsync(request);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error running Utility Recovery Report: {ex.Message}");
            }
            return ret;
        }

        [HttpGet("ShopUsageVarianceReport")]
        public async Task<ActionResult<ShopUsageVarianceReportResponse>> Get([FromQuery] ShopUsageVarianceRequest request)
        {
            return await _umfaService.GetShopUsageVarianceReportAsync(request);
        }

        [HttpGet("ShopCostVarianceReport")]
        public async Task<ActionResult<ShopCostVarianceReportResponse>> GetCostVariance([FromQuery] ShopUsageVarianceRequest request)
        {
            return await _umfaService.GetShopCostVarianceReportAsync(request);
        }

        [HttpPut("ConsumptionSummaryReport")]
        public async Task<ActionResult<ConsumptionSummaryResponse>> GetConsumptionSummary([FromBody] ConsumptionSummaryRequest request)
        {
            if(request.Shops is null || !request.Shops.Any())
            {
                request.Shops = new List<int> { 0 };
            }

            return await _umfaService.GetConsumptionSummaryReportAsync(new ConsumptionSummarySpRequest(request));
        }

        [HttpGet("ConsumptionSummaryReconReport")]
        public async Task<ActionResult<ConsumptionSummaryReconResponse>> GetConsumptionSummaryRecon([FromQuery] ConsumptionSummaryReconRequest request)
        {
            return await _umfaService.GetConsumptionSummaryReconReportAsync(request);
        }

        [HttpPost("Archives")]
        public async Task<IActionResult> ArchiveReports([FromBody] List<ArchiveReportsRequest> request)
        {
            if(!request.Any())
            {
                return BadRequest("Reports List is empty");
            }

            // create header and detail entries in portal DB
            int? headerId = null;
            try
            {
                headerId = await _archivesService.CreateArhiveRequestEntriesAsync(request);
            }
            catch(Exception e) 
            {
                _logger.LogError(e, "Error while adding archives to db");
                return Problem("Could not add reports to database");
            }

            // update umfa db file formats
            try
            {
                await _umfaService.UpdateReportArhivesFileFormatsAsync(new UpdateArchiveFileFormatSpRequest
                {
                    BuildingId = (int)request[0].BuildingId!,
                    Format = request[0].FileFormat.FileNameFormat,
                    Description = request[0].FileFormat.Description,
                    Id = (int)request[0].FileFormat.Id!
                });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not update UmfaDb FileFormats");
            }

            // send messages to queue
            try
            {
                if(headerId is not null)
                {
                    await _queueService.AddMessageToQueueAsync(headerId.ToString());
                    return Accepted();
                }
                else
                {
                    return Problem("Something went wrong");
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could queue archive reports");
                return Problem("Could not add reports to queue");
            }
        }

        [HttpGet("Archives")]
        public async Task<ActionResult<List<ArchivedReport>>> GetArchiveReports([FromQuery] GetArchivedReportsRequest request)
        {
            try
            {
                var archives = await _archivesService.GetArchivedReportsForUserAsync((int)request.UserId!);

                if (archives == null)
                {
                    return Problem("Something went wrong");
                }

                return archives.OrderByDescending(a => a.CreatedDateTime).ToList();
            }
            catch(Exception e)
            {
                _logger.LogError(e, "Could not retrieve archived reports");
                return Problem(e.Message);
            }
        }

        [HttpGet("BuildingRecoveryDiesel")]
        public async Task<ActionResult<UmfaBuildingRecoveryDataDieselResponse>> GetBuildingRecoveryDiesel([FromQuery] UmfaBuildingRecoveryDataDieselSpRequest request)
        {
            try
            {
                return await _umfaService.GetBuildingRecoveryDieselAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not retrieve recovery reports");
                return Problem(e.Message);
            }
        }

        [HttpGet("BuildingRecoveryWater")]
        public async Task<ActionResult<UmfaBuildingRecoveryDataWaterResponse>> GetBuildingRecoveryWater([FromQuery] UmfaBuildingRecoveryDataWaterSpRequest request)
        {
            try
            {
                return await _umfaService.GetBuildingRecoveryWaterAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not retrieve recovery reports");
                return Problem(e.Message);
            }
        }

        [HttpGet("BuildingRecoverySewer")]
        public async Task<ActionResult<UmfaBuildingRecoveryDataSewerResponse>> GetBuildingRecoverySewer([FromQuery] UmfaBuildingRecoveryDataSewerSpRequest request)
        {
            try
            {
                return await _umfaService.GetBuildingRecoverySewerAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not retrieve recovery reports");
                return Problem(e.Message);
            }
        }

        [HttpGet("BuildingRecoveryElectricity")]
        public async Task<ActionResult<BuildingRecoveryReport>> GetBuildingRecoverySewer([FromQuery] BuildingRecoveryReportSpRequest request)
        {
            try
            {
                return await _umfaService.GetBuildingRecoveryElectricityAsync(request);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not retrieve recovery reports");
                return Problem(e.Message);
            }
        }

        [HttpPost("FeedbackReports")]
        public async Task<ActionResult<FeedbackReportRequest>> CreateFeedbackReportRequest([FromBody] FeedbackReportRequestData request, [FromQuery] bool overwrite = false)
        {
            try
            {
                var reportRequest = await _reportsService.GetFeedbackReportRequestAsync(request);

                if(reportRequest is null)
                {
                    reportRequest = await _reportsService.AddFeedbackReportRequestAsync(request);
                }
                else if(!overwrite && reportRequest.Status != 1) // add message to queue if status is 1 (requested)
                {
                    return BadRequest("Report already exists");
                }

                if(reportRequest is null)
                {
                    _logger.LogError($"Could not create request for buildingId: {request.BuildingId} periodId: {request.PeriodId}");
                    return Problem("Something went wrong");
                }

                _logger.LogInformation("Sending feedback report queue message");
                
                await _feedbackReportsQueueService.AddMessageToQueueAsync( JsonSerializer.Serialize(new { RequestId = reportRequest.FeedbackReportRequestId, BuildingId = request.BuildingId, PeriodId = request.PeriodId }));

                return reportRequest;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could finish feedback report request");
                return Problem(e.Message);
            }
        }

        [HttpGet("FeedbackReports")]
        public async Task<ActionResult<List<FeedbackReportRequest>>> GetFeedbackReportsRequest([FromQuery, Required] int buildingId)
        {
            try
            {
                var reportRequests = await _reportsService.GetFeedbackReportsRequestAsync(buildingId);

                if (reportRequests is null)
                {
                    _logger.LogError($"Could not retrieve feedback report requests for buildingId {buildingId}");
                    return Problem($"Could not retrieve feedback report requests for buildingId {buildingId}");
                }

                return reportRequests;
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Could not retrieve feedback report requests for buildingId {buildingId}");
                return Problem(e.Message);
            }
        }

        [HttpPost("ClientFeedbackReports")]
        public async Task<ActionResult<ClientFeedbackReportRequest>> CreateClientFeedbackReportRequest([FromBody] UmfaMultiClientDumpRequest request, [FromQuery] bool overwrite = false)
        {
            try
            {
                var reportRequest = await _reportsService.AddClientFeedbackReportRequestAsync(request);

                if (reportRequest is null)
                {
                    _logger.LogError($"Could not create request for buildingId: {request.BuildingIds} periods: {request.SPeriod} : {request.EPeriod}");
                    return Problem("Something went wrong");
                }

                _logger.LogInformation("Sending client feedback report queue message");

                await _clientFeedbackReportQueueService.AddMessageToQueueAsync(reportRequest.Id.ToString());

                return reportRequest;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could finish feedback report request");
                return Problem(e.Message);
            }
        }

        [HttpGet("ClientFeedbackReports")]
        public async Task<ActionResult<List<ClientFeedbackReportRequest>>> GetClientFeedbackReportsRequest([FromQuery, Required] int clientId)
        {
            try
            {
                var reportRequests = await _reportsService.GetClientFeedbackReportsRequestAsync(clientId);

                if (reportRequests is null)
                {
                    _logger.LogError($"Could not retrieve client feedback report requests for clientId {clientId}");
                    return Problem($"Could not retrieve client feedback report requests for clientId {clientId}");
                }

                return reportRequests;
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Could not retrieve client feedback report requests for clientId {clientId}");
                return Problem(e.Message);
            }
        }

        [HttpGet("client-buildings")]
        public async Task<ActionResult<List<UmfaUserClientPartnerBuildingEntry>>> GetClientPartnerBuildingsForUser([FromQuery, Required] int umfaUserId)
        {
            try
            {
                return await _umfaService.GetClientPartnerBuildingsForUserAsync(new UmfaUserIdRequest { UserId = umfaUserId});
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Could not retrieve clientbuildings for user {umfaUserId}");
                return Problem(e.Message);
            }
        }
    }
}
