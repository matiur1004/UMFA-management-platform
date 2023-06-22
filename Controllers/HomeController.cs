using ClientPortal.Controllers.Authorization;
using ClientPortal.Helpers;
using ClientPortal.Services;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;
using System.Dynamic;

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
            string ver = (_config == null || _config.AppVersion == null) ? "NotSet" : _config.AppVersion.ToString();
            dynamic version = new ExpandoObject();
            version.Name = "AppVersion";
            version.Value = ver;

            return Ok(version);
        }
    }
}
