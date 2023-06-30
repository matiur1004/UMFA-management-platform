using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class TenantSlipsController : ControllerBase
    {
        private readonly ILogger<TenantSlipsController> _logger;
        private readonly IUmfaService _umfaService;

        public TenantSlipsController(ILogger<TenantSlipsController> logger, IUmfaService umfaService)
        {
            _logger = logger;
            _umfaService = umfaService;
        }

        // GET: api/<TenantSlips>
        [HttpGet("CardInfo")]
        public async Task<ActionResult<TenantSlipCardInfo>> GetCardInfo([FromQuery] TenantSlipCardInfoSpRequest request)
        {
            return await _umfaService.GetTenantSlipCardInfoAsync(request);
        }

        [HttpGet("Criteria")]
        public async Task<ActionResult<TenantSlipCriteriaResponse>> GetCriteria([FromQuery] TenantSlipCriteriaSpRequest request)
        {
            return await _umfaService.GetTenantSlipCriteriaAsync(request);
        }

        [HttpGet("Reports")]
        public async Task<ActionResult<TenantSlipReportSpResponse>> GetReports([FromQuery] TenantSlipReportSpRequest request)
        {
            return await _umfaService.GetTenantSlipReportsAsync(request);
        }
        
        [HttpPut("Data")]
        public async Task<ActionResult<TenantSlipDataResponse>> Getdata([FromBody] TenantSlipDataRequest request)
        {
            return await _umfaService.GetTenantSlipDataAsync(request);
        }

    }
}
