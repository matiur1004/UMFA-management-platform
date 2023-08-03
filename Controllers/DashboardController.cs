using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ILogger<DashboardController> _logger;
        readonly DashboardService _dbService;

        public DashboardController(ILogger<DashboardController> logger, DashboardService dbService)
        {
            _dbService = dbService;
            _logger = logger;
        }

        [HttpGet("getDBStats/{umfaUserId}")]
        public IActionResult GetDBStats(int umfaUserId)
        {
            try
            {
                var response = _dbService.GetMainDashboard(umfaUserId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving stats from service: {ex.Message}");
                return BadRequest($"Error while retrieving stats from service: {ex.Message}");
            }
        }

        [HttpGet("getDBBuildingStats/{umfaBuildingId}")]
        public IActionResult GetDBBuildingStats(int umfaBuildingId)
        {
            try
            {
                var response = _dbService.GetBuildingDashboard(umfaBuildingId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving stats from service: {ex.Message}");
                return BadRequest($"Error while retrieving stats from service: {ex.Message}");
            }
        }

        [HttpGet("getBuildingList/{umfaUserId}")]
        public IActionResult GetBuildingList(int umfaUserId)
        {
            try
            {
                var response = _dbService.GetBuildingList(umfaUserId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving stats from service: {ex.Message}");
                return BadRequest($"Error while retrieving stats from service: {ex.Message}");
            }
        }

        [HttpGet("buildings/{buildingId:int}/shops/billing-details")]
        public async Task<ActionResult<List<ShopDashboardBillingDetail>>> GetShopsData(int buildingId)
        {
            try
            {
                return await _dbService.GetShopDataAsync(buildingId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving shop data from service: {ex.Message}");
                return BadRequest($"Error while retrieving shop from service: {ex.Message}");
            }
        }
    }
}
