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

        // PUT: UserNotifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserNotifications(int id, UserNotifications userNotifications)
        {
            if (id != userNotifications.Id)
            {
                return BadRequest();
            }

            _context.Entry(userNotifications).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserNotificationsExists(id))
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

        // POST: UserNotifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserNotifications>> PostUserNotifications(UserNotifications userNotifications)
        {
            _context.UserNotifications.Add(userNotifications);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserNotifications", new { id = userNotifications.Id }, userNotifications);
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
