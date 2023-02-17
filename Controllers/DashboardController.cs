using ClientPortal.Controllers.Authorization;
using ClientPortal.Services;
using Microsoft.AspNetCore.DataProtection;

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

        [HttpGet("getDBStats/{umfauserid}")]
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
    }
}
