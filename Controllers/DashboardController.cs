﻿using ClientPortal.Controllers.Authorization;
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
    }
}
