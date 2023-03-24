using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class SupplyTypesController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public SupplyTypesController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: SupplyTypes
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<SupplyType>>> GetSupplyTypes()
        {
            return await _context.SupplyTypes.ToListAsync();
        }

        // GET: SupplyTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplyType>> GetSupplyType(int id)
        {
            var supplyType = await _context.SupplyTypes.FindAsync(id);

            if (supplyType == null)
            {
                return NotFound();
            }

            return supplyType;
        }

        // PUT: SupplyTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSupplyType(int id, SupplyType supplyType)
        {
            if (id != supplyType.SupplyTypeId)
            {
                return BadRequest();
            }

            _context.Entry(supplyType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplyTypeExists(id))
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

        // POST: SupplyTypes
        [HttpPost]
        public async Task<ActionResult<SupplyType>> PostSupplyType(SupplyType supplyType)
        {
            _context.SupplyTypes.Add(supplyType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSupplyType", new { id = supplyType.SupplyTypeId }, supplyType);
        }

        // DELETE: SupplyTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplyType(int id)
        {
            var supplyType = await _context.SupplyTypes.FindAsync(id);
            if (supplyType == null)
            {
                return NotFound();
            }

            _context.SupplyTypes.Remove(supplyType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SupplyTypeExists(int id)
        {
            return _context.SupplyTypes.Any(e => e.SupplyTypeId == id);
        }
    }
}
