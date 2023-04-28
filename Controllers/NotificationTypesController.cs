using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class NotificationTypesController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public NotificationTypesController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: NotificationTypes
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<NotificationType>>> GetNotificationTypes()
        {
            return await _context.NotificationTypes.ToListAsync();
        }

        // GET: NotificationTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotificationType>> GetNotificationType(int id)
        {
            var notificationType = await _context.NotificationTypes.FindAsync(id);

            if (notificationType == null)
            {
                return NotFound();
            }

            return notificationType;
        }

        // PUT: NotificationTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotificationType(int id, NotificationType notificationType)
        {
            if (id != notificationType.Id)
            {
                return BadRequest();
            }

            _context.Entry(notificationType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationTypeExists(id))
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

        // POST: NotificationTypes
        [HttpPost]
        public async Task<ActionResult<NotificationType>> PostNotificationType(NotificationType notificationType)
        {
            _context.NotificationTypes.Add(notificationType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotificationType", new { id = notificationType.Id }, notificationType);
        }

        // DELETE: NotificationTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationType(int id)
        {
            var notificationType = await _context.NotificationTypes.FindAsync(id);
            if (notificationType == null)
            {
                return NotFound();
            }

            _context.NotificationTypes.Remove(notificationType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotificationTypeExists(int id)
        {
            return _context.NotificationTypes.Any(e => e.Id == id);
        }
    }
}
