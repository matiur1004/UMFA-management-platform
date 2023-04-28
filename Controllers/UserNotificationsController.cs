using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UserNotificationsController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public UserNotificationsController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: UserNotifications
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<UserNotifications>>> GetUserNotifications()
        {
            return await _context.UserNotifications.ToListAsync();
        }

        // GET: UserNotifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserNotifications>> GetUserNotifications(int id)
        {
            var userNotifications = await _context.UserNotifications.FindAsync(id);

            if (userNotifications == null)
            {
                return NotFound();
            }

            return userNotifications;
        }

        [HttpGet("getAllUserNotificationsForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<UserNotifications>>> GetAllUserNotificationsForUser(int userId)
        {
            var userNotifications = await _context.UserNotifications.Where(n => n.UserId == userId).ToListAsync();

            if (userNotifications == null)
            {
                return NotFound();
            }
            return  userNotifications;
        }

        // POST: UserNotifications
        [HttpPost("createOrUpdateUserNotifications")]
        public async Task<ActionResult<UserNotifications>> CreateOrUpdateUserNotifications(UserNotifications userNotifications)
        {
            if(userNotifications.Id == 0) //Create
            {
                _context.UserNotifications.Add(userNotifications);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetUserNotifications", new { id = userNotifications.Id }, userNotifications);
            }
            else                          //Update  
            {
                _context.Entry(userNotifications).State = EntityState.Modified;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserNotificationsExists(userNotifications.Id))
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
        public async Task<IActionResult> DeleteUserNotifications(int id)
        {
            var userNotifications = await _context.UserNotifications.FindAsync(id);
            if (userNotifications == null)
            {
                return NotFound();
            }

            _context.UserNotifications.Remove(userNotifications);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserNotificationsExists(int id)
        {
            return _context.UserNotifications.Any(e => e.Id == id);
        }
    }
}
