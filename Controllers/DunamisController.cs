using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.DunamisEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class DunamisController : ControllerBase
    {
        private readonly ILogger<DunamisController> _logger;
        readonly DunamisDBContext _dbService;

        public DunamisController(ILogger<DunamisController> logger, DunamisDBContext dbService)
        {
            _dbService = dbService;
            _logger = logger;
        }

        [HttpGet("getAllSuppliesTo")]
        public async Task<ActionResult<IEnumerable<SuppliesTo>>> GetAllSuppliesTo()
        {
            try
            {
                return await _dbService.SuppliesTo.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving SuppliesTo Items: {ex.Message}");
                return BadRequest($"Error while retrieving SuppliesTo Items: {ex.Message}");
            }
        }
    }
}
