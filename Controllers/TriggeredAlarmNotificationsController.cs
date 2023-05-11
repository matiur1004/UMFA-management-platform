using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using Dapper;
using System.Dynamic;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TriggeredAlarmNotificationsController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public TriggeredAlarmNotificationsController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: TriggeredAlarmNotifications
        [HttpGet("getTriggeredAlarmNotifications")]
        public async Task<ActionResult<IEnumerable<TriggeredAlarmNotification>>> GetTriggeredAlarmNotifications()
        {
          if (_context.TriggeredAlarmNotifications == null)
          {
              return NotFound();
          }
            return await _context.TriggeredAlarmNotifications.ToListAsync();
        }

        // GET: TriggeredAlarmNotifications/5
        [HttpGet("getTriggeredAlarmNotification/{id}")]
        public async Task<ActionResult<TriggeredAlarmNotification>> GetTriggeredAlarmNotification(int id)
        {
            if (_context.TriggeredAlarmNotifications == null)
            {
                return NotFound();
            }
            var triggeredAlarmNotification = await _context.TriggeredAlarmNotifications.FindAsync(id);

            if (triggeredAlarmNotification == null)
            {
                return NotFound();
            }

            return triggeredAlarmNotification;
        }

        // GET: ActiveTriggeredAlarmNotificationsForUser
        [HttpGet("getActiveTriggeredAlarmNotificationsForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<TriggeredAlarmNotification>>> GetActiveTriggeredAlarmNotificationsForUser(int userId)
        {
            if (_context.TriggeredAlarmNotifications == null)
            {
                return NotFound();
            }
            return await _context.TriggeredAlarmNotifications
                .Where(a => (a.Active && a.UserId == userId))
                .ToListAsync();
        }

        // GET: AllTriggeredAlarmNotificationsForUser
        [HttpGet("getAllTriggeredAlarmNotificationsForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<TriggeredAlarmNotification>>> GetAllTriggeredAlarmNotificationsForUser(int userId)
        {
            if (_context.TriggeredAlarmNotifications == null)
            {
                return NotFound();
            }
            return await _context.TriggeredAlarmNotifications
                .Where(a => (a.UserId == userId))
                .ToListAsync();
        }

        // POST: CreateOrUpdateTriggeredAlarmNotification
        [HttpPost("createOrUpdateTriggeredAlarmNotification")]
        public async Task<ActionResult<TriggeredAlarmNotification>> CreateOrUpdateTriggeredAlarmNotification(TriggeredAlarmNotification triggeredAlarmNotification)
        {
          if (_context.TriggeredAlarmNotifications == null)
          {
              return Problem("Entity set 'PortalDBContext.TriggeredAlarmNotifications'  is null.");
          }

          if(triggeredAlarmNotification.TriggeredAlarmNotificationId > 0) 
            {   
                // UPDATE
                _context.Entry(triggeredAlarmNotification).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TriggeredAlarmNotificationExists(triggeredAlarmNotification.TriggeredAlarmNotificationId))
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
            else                                                         
            {
                // ADD
                _context.TriggeredAlarmNotifications.Add(triggeredAlarmNotification);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetTriggeredAlarmNotification", new { id = triggeredAlarmNotification.TriggeredAlarmNotificationId }, triggeredAlarmNotification);
            }
        }

        // DELETE: TriggeredAlarmNotifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTriggeredAlarmNotification(int id)
        {
            if (_context.TriggeredAlarmNotifications == null)
            {
                return NotFound();
            }
            var triggeredAlarmNotification = await _context.TriggeredAlarmNotifications.FindAsync(id);
            if (triggeredAlarmNotification == null)
            {
                return NotFound();
            }

            _context.TriggeredAlarmNotifications.Remove(triggeredAlarmNotification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("getNotificationsToSend")]
        public ActionResult<IEnumerable<dynamic>> GetNotificationsToSend()
        {
            List<dynamic> resultList = new List<dynamic>();
            try
            {
                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "spGetNotificationsToSend";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    _context.Database.OpenConnection();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dynamic result = new ExpandoObject();
                            var dictionary = result as IDictionary<string, object>;

                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                            }
                            resultList.Add(result);
                        }
                    }
                }
            }
            catch (Exception)
            {
                return Problem($"Failed to get NotificationsToSend");
            }
            return Ok(resultList);
        }

        private bool TriggeredAlarmNotificationExists(int id)
        {
            return (_context.TriggeredAlarmNotifications?.Any(e => e.TriggeredAlarmNotificationId == id)).GetValueOrDefault();
        }
    }
}