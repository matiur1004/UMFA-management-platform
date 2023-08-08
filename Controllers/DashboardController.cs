﻿using ClientPortal.Controllers.Authorization;
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
    }
}
