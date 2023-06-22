using ClientPortal.Controllers.Authorization;
using ClientPortal.Helpers;
using ClientPortal.Services;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHomeService _dashboardService;
        private readonly AppSettings _config;

        public HomeController(ILogger<HomeController> logger, IHomeService dashboardService, IOptions<AppSettings> config)
        {
            _logger = logger;
            _dashboardService = dashboardService;
            _config = config.Value;
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
        [AllowAnonymous]
        [HttpGet("getAppVersion")]
        public IActionResult GetAppVersion()
        {
            string version = _config.AppVersion;
            if (!String.IsNullOrEmpty(version))
                return Ok(version);
            else return Ok("NotSet");
        }
    }
}
