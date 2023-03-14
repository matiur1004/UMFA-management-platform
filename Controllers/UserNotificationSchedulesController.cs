using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UserNotificationSchedulesController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public UserNotificationSchedulesController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: NotificationSchedules
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<UserNotificationSchedule>>> GetNotificationSchedules()
        {
            return await _context.UserNotificationSchedules.ToListAsync();
        }

        // GET: GetNotificationSchedule/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserNotificationSchedule>> GetNotificationSchedule(int id)
        {
            var userNotificationSchedules = await _context.UserNotificationSchedules.FindAsync(id);

            if (userNotificationSchedules == null)
            {
                return NotFound();
            }

            return userNotificationSchedules;
        }

        [HttpGet("getAllUserForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<UserNotificationSchedule>>> GetAllNotificationSchedulesForUser(int userId)
        {
            var userNotificationSchedules = await _context.UserNotificationSchedules.Where(n => n.UserId == userId).ToListAsync();

            if (userNotificationSchedules == null)
            {
                return NotFound();
            }
            return userNotificationSchedules;
        }

        // POST: UserNotifications
        [HttpPost("createOrUpdate")]
        public async Task<ActionResult<UserNotificationSchedule>> CreateOrUpdateNotificationSchedule(UserNotificationSchedule userNotificationSchedules)
        {
            if (userNotificationSchedules.Id == 0) //Create
            {
                _context.UserNotificationSchedules.Add(userNotificationSchedules);
                await _context.SaveChangesAsync();
                return CreatedAtAction("CreateOrUpdateUserNotificationSchedule", new { id = userNotificationSchedules.Id }, userNotificationSchedules);
            }
            else                                  //Update  
            {
                _context.Entry(userNotificationSchedules).State = EntityState.Modified;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserNotificationsScheduleExists(userNotificationSchedules.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return NoContent();
        }

        // DELETE: UserNotifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserNotificationSchedule(int id)
        {
            var userNotificationSchedules = await _context.UserNotificationSchedules.FindAsync(id);
            if (userNotificationSchedules == null)
            {
                return NotFound();
            }

            _context.UserNotificationSchedules.Remove(userNotificationSchedules);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserNotificationsScheduleExists(int id)
        {
            return _context.UserNotificationSchedules.Any(e => e.Id == id);
        }

        [HttpGet("getAllSummaryTypes")] //To Get SummaryTypes Name and Id
        public async Task<ActionResult<IEnumerable<UserNotificationSummaryType>>> GetNotificationSummaryTypes()
        {
            return await _context.UserNotificationSummaryTypes.ToListAsync();
        }
    }
}
