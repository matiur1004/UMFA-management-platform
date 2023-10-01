using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ILogger<DashboardController> _logger;
        private readonly DashboardService _dbService;
        private readonly IUmfaService _umfaService;

        public DashboardController(ILogger<DashboardController> logger, DashboardService dbService, IUmfaService umfaService)
        {
            _dbService = dbService;
            _logger = logger;
            _umfaService = umfaService;
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

        [HttpGet("tenants/{umfaUserId}")]
        public async Task<ActionResult<TenantMainDashboardResponse>> GetTenantDBStats(int umfaUserId)
        {
            try
            {
                return await _dbService.GetTenantMainDashboard(umfaUserId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving stats from service: {ex.Message}");
                return Problem($"Error while retrieving stats from service: {ex.Message}");
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

        [HttpGet("buildings/{buildingId:int}/shops")]
        public async Task<ActionResult<List<ShopDashboardShop>>> GetShopsData(int buildingId)
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

        [HttpGet("buildings/{buildingId:int}/tenants/{umfaUserId:int}/shops")]
        public async Task<ActionResult<List<UmfaShopDashboardTenantShop>>> GetTenantShopsData(int buildingId, int umfaUserId)
        {
            try
            {
                return await _umfaService.GetShopDashboardTenantShopsAsync(buildingId, umfaUserId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving shop data from service: {ex.Message}");
                return Problem($"Error while retrieving shop from service: {ex.Message}");
            }
        }

        [HttpGet("buildings/{buildingId:int}/shops/{shopId:int}")]
        public async Task<ActionResult<ShopDashboardResponse>> GetDashboardShopData(int buildingId, int shopId, [FromQuery, Range(1, int.MaxValue)] int history = 12)
        {
            try
            {
                return await _umfaService.GetShopDashboardMainAsync(buildingId, shopId, history);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not get shops");
                return Problem(e.Message);
            }
        }

        [HttpGet("buildings/{buildingId:int}/shops/{shopId:int}/billing-details")]
        public async Task<ActionResult<List<UmfaShopDashboardBillingDetail>>> GetDashboardShopBillingData(int buildingId, int shopId, [FromQuery, Range(1, int.MaxValue)] int history = 12)
        {
            try
            {
                return await _umfaService.GetShopDashboardBillingDetailsAsync(buildingId, shopId, history);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not get shop billing details");
                return Problem(e.Message);
            }
        }

        [HttpGet("buildings/{buildingId:int}/shops/{shopId:int}/occupations")]
        public async Task<ActionResult<List<UmfaShopDashboardOccupation>>> GetDashboardShopOccupations(int buildingId, int shopId)
        {
            try
            {
                return await _umfaService.GetShopDashboardOccupationsAsync(buildingId, shopId);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not get shop occupations");
                return Problem(e.Message);
            }
        }

        [HttpGet("buildings/{buildingId:int}/shops/{shopId:int}/assigned-meters")]
        public async Task<ActionResult<List<UmfaShopDashboardAssignedMeter>>> GetDashboardShopAssignedMeters(int buildingId, int shopId, [FromQuery, Range(1, int.MaxValue)] int history = 6)
        {
            try
            {
                return await _umfaService.GetShopDashboardAssignedMetersAsync(buildingId, shopId, history);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not get shop assigned meter");
                return Problem(e.Message);
            }
        }

        [HttpGet("buildings/{buildingId:int}/shops/{shopId:int}/meters/{meterId:int}/readings")]
        public async Task<ActionResult<List<UmfaShopDashboardReading>>> GetDashboardReadings(int buildingId, int shopId, int meterId, [FromQuery, Range(1, int.MaxValue)] int history = 36)
        {
            try
            {
                return await _umfaService.GetShopDashboardReadingsAsync(buildingId, shopId, meterId, history);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Could not get shop meter readings");
                return Problem(e.Message);
            }
        }
    }
}
