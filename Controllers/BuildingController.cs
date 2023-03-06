using Microsoft.AspNetCore.Cors;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class BuildingController : ControllerBase
    {
        private readonly ILogger<BuildingController> _logger;
        private readonly IBuildingService _buildingService;

        public BuildingController(ILogger<BuildingController> logger,
            IBuildingService buildingService)
        {
            _logger = logger;
            _buildingService = buildingService;
        }

        [HttpGet("umfaBuildings/{umfaUserId}")]
        public IActionResult GetUmfaBuildings(int umfaUserId)
        {
            _logger.LogInformation($"Get umfa buildngs via service for user {umfaUserId}");
            try
            {
                var response = _buildingService.GetUmfaBuildingsAsync(umfaUserId).Result.UmfaBuildings;
                if (response != null)
                {
                    _logger.LogInformation($"Successfully got umfa buildings for user {umfaUserId}");
                    return Ok(response);
                }
                else throw new ApplicationException($"Failed to get umfa buildings for user {umfaUserId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting buildings for user {umfaUserId}: {ex.Message}");
                return BadRequest(new ApplicationException(ex.Message));
            }
        }

        [HttpGet("umfaMeters/{umfaBuildingId}")]
        public IActionResult GetUmfaMeters(int umfaBuildingId)
        {
            _logger.LogInformation($"Get umfa meters via service for building {umfaBuildingId}");
            try
            {
                var response = _buildingService.GetUmfaMetersAsync(umfaBuildingId).Result.UmfaMeters;
                if (response != null)
                {
                    _logger.LogInformation($"Successfully got umfa meters for building {umfaBuildingId}");
                    return Ok(response);
                }
                else throw new ApplicationException($"Failed to get umfa meters for building {umfaBuildingId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting meters for building {umfaBuildingId}: {ex.Message}");
                return BadRequest(new ApplicationException(ex.Message));
            }
        }


        [HttpGet("Periods/{umfaBuildingId:int}")]
        public IActionResult GetPeriods(int umfaBuildingId)
        {
            _logger.LogInformation("API initiated to retrieve periods for building {buildingId", umfaBuildingId);
            try
            {
                var resp = _buildingService.GetPeriodsForBuildingAsync(umfaBuildingId).Result;
                if (resp != null)
                {
                    _logger.LogInformation($"Successfully got periods for building {umfaBuildingId}");
                    return Ok(resp);
                }
                else throw new ApplicationException($"Failed to get periods for building {umfaBuildingId}");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in API for retrieving periods: {msg}", ex.Message);
                return BadRequest(new ApplicationException($"Error in API for retrieving periods: {ex.Message}"));
            }
        }

        [HttpGet("Partners/{umfaUserId:int}")]
        public IActionResult GetPartners(int umfaUserId)
        {
            _logger.LogInformation("API initiated to retrieve partners for user {umfaUserId", umfaUserId);
            try
            {
                var resp = _buildingService.GetPartnersForUserAsync(umfaUserId).Result;
                if (resp != null)
                {
                    _logger.LogInformation($"Successfully got partners for user {umfaUserId}");
                    return Ok(resp);
                }
                else throw new ApplicationException($"Failed to get partners for user {umfaUserId}");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in API for retrieving partners: {msg}", ex.Message);
                return BadRequest(new ApplicationException($"Error in API for retrieving partners: {ex.Message}"));
            }
        }
    }
}
