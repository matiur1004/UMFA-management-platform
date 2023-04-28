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
        readonly DunamisDBContext _context;

        public DunamisController(ILogger<DunamisController> logger, DunamisDBContext dbService)
        {
            _context = dbService;
            _logger = logger;
        }
        //SuppliesTo
        //GET: Dunamis/getAllSuppliesTo
        [HttpGet("getAllSuppliesTo")]
        public async Task<ActionResult<IEnumerable<SuppliesTo>>> GetAllSuppliesTo()
        {
            try
            {
                return await _context.SuppliesTo.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving SuppliesTo Items: {ex.Message}");
                return BadRequest($"Error while retrieving SuppliesTo Items: {ex.Message}");
            }
        }

        //LocationType
        //GET: Dunamis/getAllLocationTypes
        [HttpGet("getAllLocationTypes")]
        public async Task<List<LocationType>> GetAllLocationTypes()
        {
            try
            {
                var locationTypes = await _context.LocationTypes.FromSqlRaw("SELECT t.name AS SuppliesTo, " +
               "CASE typ.SupplyType WHEN 0 THEN 'Electricity' WHEN 1 THEN 'Water' WHEN 2 THEN 'Gas' WHEN 3 THEN 'Sewerage' " +
               "WHEN 4 THEN 'Solar' ELSE 'AdHoc' END AS SupplyType, loc.Name AS LocationName FROM SuppliesTo t " +
               "JOIN SuppliesToSupplyTypes typ ON (t.Id = typ.SuppliesToId)" +
               "JOIN SuppliesToSupplyTypesLocations l ON (typ.Id = l.SuppliesToSupplyTypeId)" +
               "JOIN SupplyToLocations loc ON (l.SupplyToLocationId = loc.Id) ORDER BY 1, 2, 3").ToListAsync();
                return locationTypes.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving SuppliesTo Items: {ex.Message}");
                return new List<LocationType> { };
            }           
        }
    }
}
