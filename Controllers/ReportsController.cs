﻿using ClientPortal.Controllers.Authorization;
using ClientPortal.Data.Entities.PortalEntities;
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
        private readonly IUmfaService _umfaService;
        private readonly IArchivesQueueService _queueService;
        private readonly IArchivesService _archivesService;

        public ReportsController(ILogger<ReportsController> logger, IUmfaService umfaReportService, IArchivesQueueService queueService, IArchivesService archivesServices) 
        {
            _logger = logger;
            _umfaService = umfaReportService;
            _queueService = queueService;
            _archivesService = archivesServices;
        }

        [HttpGet("UtilityRecoveryReport")]
        public async Task<ActionResult<UtilityRecoveryReportResponse>> Get([FromQuery] UtilityRecoveryReportRequest request)
        {
            return await _umfaService.GetUtilityRecoveryReportAsync(request);
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
    }
}
