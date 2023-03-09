using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.DunamisEntities;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Services;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class MappedMetersController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly DunamisDBContext _dbContext;
        private readonly MappedMetersService _mappedMetersService;

        public MappedMetersController(PortalDBContext context, DunamisDBContext dBContext, MappedMetersService mappedMetersService)
        {
            _context = context;
            _dbContext = dBContext;
            _mappedMetersService = mappedMetersService;
        }

        // GET: MappedMeters/GetAll
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<MappedMeter>>> GetMappedMeters()
        {
            return await _context.MappedMeters.ToListAsync();
        }

        //GET: MappedMeters/GetAllMappedMetersForBuilding/
        [HttpGet("GetAllMappedMetersForBuilding/{buildingId}")]
        public async Task<ActionResult<IEnumerable<MappedMeter>>> GetAllMappedMetersForBuilding(int buildingId)
        {
            var selectedMeters = await _mappedMetersService.GetAllMappedMetersForBuilding(buildingId);
            return selectedMeters;
        }

        // GET: MappedMeters/GetMappedMeter/5
        [HttpGet("GetMappedMeter/{id}")]
        public async Task<ActionResult<MappedMeter>> GetMappedMeter(int id)
        {
            var mappedMeter = await _context.MappedMeters.FindAsync(id);

            if (mappedMeter == null)
            {
                return NotFound();
            }

            return mappedMeter;
        }

        // PUT: MappedMeters/UpdateMappedMeter/5
        [HttpPut("UpdateMappedMeter/{id}")]
        public async Task<IActionResult> PutMappedMeter(int id, MappedMeter mappedMeter)
        {
            if (id != mappedMeter.MappedMeterId)
            {
                return BadRequest();
            }

            _context.Entry(mappedMeter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MappedMeterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: MappedMeters/AddMappedMeter/{MappedMeter}
        [HttpPost("AddMappedMeter")]
        public async Task<ActionResult<MappedMeter>> PostMappedMeter(MappedMeter mappedMeter)
        {
            _context.MappedMeters.Add(mappedMeter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMappedMeter", new { id = mappedMeter.MappedMeterId }, mappedMeter);
        }

        // DELETE: MappedMeters/RemoveMappedMeter/5
        [HttpDelete("RemoveMappedMeter/{id}")]
        public async Task<IActionResult> DeleteMappedMeter(int id)
        {
            var mappedMeter = await _context.MappedMeters.FindAsync(id);
            if (mappedMeter == null)
            {
                return NotFound();
            }

            _context.MappedMeters.Remove(mappedMeter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MappedMeterExists(int id)
        {
            return _context.MappedMeters.Any(e => e.MappedMeterId == id);
        }

        // MappedMeters Dropdowns

        //RegisterTypes
        // GET: MappedMeters/getAllRegisterTypes
        [HttpGet("getAllRegisterTypes")]
        public async Task<ActionResult<IEnumerable<RegisterType>>> GetAllRegisterTypes()
        {
            return await _context.RegisterTypes.ToListAsync();
        }

        //TimeOfUse
        //GET: MappedMeters/getAllTimeOfUse
        [HttpGet("getAllTimeOfUse")]
        public async Task<ActionResult<IEnumerable<TOUHeader>>> GetAllTouHeaders()
        {
            return await _context.TOUHeaders.ToListAsync();
        }

        //SupplyTypes
        //GET: MappedMeters/getAllSupplyTypes
        [HttpGet("getAllSupplyTypes")]
        public async Task<ActionResult<IEnumerable<SupplyType>>> GetAllSupplyTypes()
        {
            return await _context.SupplyTypes.ToListAsync();
        }

        //SupplyTo
        //GET: MappedMeters/getAllSuppliesTo
        [HttpGet("getAllSuppliesTo")]
        public async Task<ActionResult<IEnumerable<SuppliesTo>>> GetAllSuppliesTo()
        {
            return await _dbContext.SuppliesTo.ToListAsync();
        }

        //LocationType
        //GET: MappedMeters/getAllLocationTypes
        [HttpGet("getAllLocationTypes")]
        public async Task<ActionResult<IEnumerable<LocationType>>> GetAllLocationTypes()
        {
            return await _dbContext.LocationType.ToListAsync();
        }

    }
}
