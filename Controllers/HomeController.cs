using DevExpress.DashboardAspNetCore;
using Microsoft.AspNetCore.Cors;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class HomeController: ControllerBase
    {
        private readonly ILogger<DashboardController> _logger;
        private readonly IHomeService _dashboardService;

        public HomeController(ILogger<DashboardController> logger, IHomeService dashboardService)
        {
            _logger = logger;
            _dashboardService = dashboardService;
        }

        [HttpGet("get-stats")]
        public IActionResult GetStats()
        {
            try
            {
                var response = _dashboardService.GetHomeStats();
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
