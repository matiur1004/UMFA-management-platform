using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AlarmTriggerMethodsController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<AlarmTriggerMethodsController> _logger;

        public AlarmTriggerMethodsController(PortalDBContext context, ILogger<AlarmTriggerMethodsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: getAll
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<AlarmTriggerMethod>>> GetAlarmTriggerMethods()
        {
            if(_context.AlarmTriggerMethods == null)
            {
                _logger.LogError($"AlarmTriggerMethods Are Empty!");
                return NotFound();
            }
            _logger.LogInformation("Successfully Retrieved All AlarmTriggerMethods");
            return await _context.AlarmTriggerMethods.ToListAsync();
        }

        // GET: getSingle/5
        [HttpGet("getSingle/{id}")]
        public async Task<ActionResult<AlarmTriggerMethod>> GetAlarmTriggerMethod(int id)
        {
            if(_context.AlarmTriggerMethods == null)
            {
                _logger.LogError($"AlarmTriggerMethod With Id: {id} does not exist!");
                return NotFound();
            }
            var alarmType = await _context.AlarmTriggerMethods.FindAsync(id);

            if(alarmType == null)
            {
                _logger.LogError($"AlarmTriggerMethod With Id: {id} does not exist!");
                return NotFound();
            }
            _logger.LogInformation($"Successfully Retrieved AlarmTriggerMethod with Id: {id}");
            return alarmType;
        }

        // POST: createOrUpdateAlarmTriggerMethod
        [HttpPost("createOrUpdateAlarmTriggerMethod")]
        public async Task<ActionResult<AlarmTriggerMethod>> CreateOrUpdateAlarmTriggerMethod(
            AlarmTriggerMethod alarmType)
        {
            if(_context.AlarmTriggerMethods == null)
            {
                return Problem("Entity set 'PortalDBContext.AlarmTriggerMethods'  is null.");
            }
            if(alarmType.AlarmTriggerMethodId == 0) //Create
            {
                _context.AlarmTriggerMethods.Add(alarmType);
                await _context.SaveChangesAsync();
                _logger.LogInformation(
                    $"Successfully Created AlarmTriggerMethod with ID: {alarmType.AlarmTriggerMethodId}");
                return CreatedAtAction(
                    "CreateOrUpdateAlarmTriggerMethod",
                    new { id = alarmType.AlarmTriggerMethodId },
                    alarmType);
            } else                         //Update
            {
                _context.Entry(alarmType).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation(
                        $"Successfully Updated AlarmTriggerMethod with ID: {alarmType.AlarmTriggerMethodId}");
                    return CreatedAtAction(
                        "CreateOrUpdateAlarmTriggerMethod",
                        new { id = alarmType.AlarmTriggerMethodId },
                        alarmType);
                } catch(DbUpdateConcurrencyException)
                {
                    if(!AlarmTriggerMethodExists(alarmType.AlarmTriggerMethodId))
                    {
                        _logger.LogError(
                            $"AlarmTriggerMethod With Id: {alarmType.AlarmTriggerMethodId} does not exist!");
                        return NotFound();
                    } else
                    {
                        _logger.LogError($"Database Confirmation on AlarmTriggerMethod does exist and was Updated!");
                        return NoContent();
                    }
                }
            }
        }

        // DELETE: AlarmTriggerMethods/delete/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAlarmTriggerMethod(int id)
        {
            if(_context.AlarmTriggerMethods == null)
            {
                _logger.LogError($"AlarmTriggerMethod With Id: {id} does not exist!");
                return NotFound();
            }
            var alarmType = await _context.AlarmTriggerMethods.FindAsync(id);
            if(alarmType == null)
            {
                _logger.LogError($"AlarmTriggerMethod With Id: {id} does not exist!");
                return NotFound();
            }

            _context.AlarmTriggerMethods.Remove(alarmType);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully Deleted AlarmTriggerMethod with ID: {alarmType.AlarmTriggerMethodId}");
            return NoContent();
        }

        private bool AlarmTriggerMethodExists(int id)
        { return (_context.AlarmTriggerMethods?.Any(e => e.AlarmTriggerMethodId == id)).GetValueOrDefault(); }
    }
}
