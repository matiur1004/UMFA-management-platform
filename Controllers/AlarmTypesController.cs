using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AlarmTypesController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<AlarmTypesController> _logger;

        public AlarmTypesController(PortalDBContext context, ILogger<AlarmTypesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: AlarmTypes
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<AlarmType>>> GetAlarmTypes()
        {
          if (_context.AlarmTypes == null)
          {
                _logger.LogError($"AlarmTypes Are Empty!");
                return NotFound();
          }
            _logger.LogInformation("Successfully Retrieved All AlarmTypes");
            return await _context.AlarmTypes.ToListAsync();
        }

        // GET: AlarmTypes/5
        [HttpGet("getSingle/{id}")]
        public async Task<ActionResult<AlarmType>> GetAlarmType(int id)
        {
          if (_context.AlarmTypes == null)
          {
                _logger.LogError($"AlarmType With Id: {id} does not exist!");
                return NotFound();
          }
            var alarmType = await _context.AlarmTypes.FindAsync(id);

            if (alarmType == null)
            {
                _logger.LogError($"AlarmType With Id: {id} does not exist!");
                return NotFound();
            }
            _logger.LogInformation($"Successfully Retrieved AlarmType with Id: {id}");
            return alarmType;
        }

        // POST: AlarmTypes
        [HttpPost("createOrUpdateAlarmType")]
        public async Task<ActionResult<AlarmType>> CreateOrUpdateAlarmType(AlarmType alarmType)
        {
          if (_context.AlarmTypes == null)
          {
              return Problem("Entity set 'PortalDBContext.AlarmTypes'  is null.");
          }
          if(alarmType.AlarmTypeId == 0) //Create
            {
                _context.AlarmTypes.Add(alarmType);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully Created AlarmType with ID: {alarmType.AlarmTypeId}");
                return CreatedAtAction("CreateOrUpdateAlarmType", new { id = alarmType.AlarmTypeId }, alarmType);
            }
            else                         //Update
            {
                _context.Entry(alarmType).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Successfully Updated AlarmType with ID: {alarmType.AlarmTypeId}");
                    return CreatedAtAction("CreateOrUpdateAlarmType", new { id = alarmType.AlarmTypeId }, alarmType);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AlarmTypeExists(alarmType.AlarmTypeId))
                    {
                        _logger.LogError($"AlarmType With Id: {alarmType.AlarmTypeId} does not exist!");
                        return NotFound();
                    }
                    else
                    {
                        _logger.LogError($"Database Confirmation on AlarmType does exist and was Updated!");
                        return NoContent();
                    }
                }
            }
        }

        // DELETE: AlarmTypes/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAlarmType(int id)
        {
            if (_context.AlarmTypes == null)
            {
                _logger.LogError($"AlarmType With Id: {id} does not exist!");
                return NotFound();
            }
            var alarmType = await _context.AlarmTypes.FindAsync(id);
            if (alarmType == null)
            {
                _logger.LogError($"AlarmType With Id: {id} does not exist!");
                return NotFound();
            }

            _context.AlarmTypes.Remove(alarmType);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully Deleted AlarmType with ID: {alarmType.AlarmTypeId}");
            return NoContent();
        }

        private bool AlarmTypeExists(int id)
        {
            return (_context.AlarmTypes?.Any(e => e.AlarmTypeId == id)).GetValueOrDefault();
        }
    }
}
