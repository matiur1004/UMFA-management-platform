using ClientPortal.Controllers.Authorization;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHomeService _dashboardService;
        private readonly IConfiguration _config;

        public HomeController(ILogger<HomeController> logger, IHomeService dashboardService, IConfiguration config)
        {
            _logger = logger;
            _dashboardService = dashboardService;
            _config = config;
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

        [HttpGet("getAppVersion")]
        public IActionResult GetAppVersion()
        {
            string version = _config["AppVersion"];
            if (!String.IsNullOrEmpty(version))
                return Ok(version);
            else return Ok("NotSet");
        }
    }
}
