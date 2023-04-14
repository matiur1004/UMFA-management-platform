﻿using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.RequestModels;

namespace ClientPortal.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AMRMeterAlarmsController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<AMRMeterAlarmsController> _logger;

        public AMRMeterAlarmsController(PortalDBContext context, ILogger<AMRMeterAlarmsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: AMRMeterAlarms
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<AMRMeterAlarm>>> GetAMRMeterAlarms()
        {
            if (_context.AMRMeterAlarms == null)
            {
                _logger.LogError($"AMRMeterAlarms Are Empty!");
                return NotFound();
            }
            _logger.LogInformation("Successfully Retrieved All AMRMeterAlarms");
            return await _context.AMRMeterAlarms.ToListAsync();
        }

        // GET: AMRMeterAlarms/5
        [HttpGet("getSingle/{id}")]
        public async Task<ActionResult<AMRMeterAlarm>> GetAMRMeterAlarm(int id)
        {
            if (_context.AMRMeterAlarms == null)
            {
                _logger.LogError($"AMRMeterAlarm With Id: {id} does not exist!");
                return NotFound();
            }
            var alarmType = await _context.AMRMeterAlarms.FindAsync(id);

            if (alarmType == null)
            {
                _logger.LogError($"AMRMeterAlarm With Id: {id} does not exist!");
                return NotFound();
            }
            _logger.LogInformation($"Successfully Retrieved AMRMeterAlarm with Id: {id}");
            return alarmType;
        }

        // POST: AMRMeterAlarms
        [HttpPost("createOrUpdateAMRMeterAlarmByAlarmTypeName")]
        public async Task<ActionResult<AMRMeterAlarm>> CreateOrUpdateAMRMeterAlarm(AMRMeterAlarmRequest alarmType)
        {
            if (_context.AMRMeterAlarms == null)
            {
                return Problem("Entity set 'PortalDBContext.AMRMeterAlarms'  is null.");
            }
            
            var alarmTypeResponse = new AMRMeterAlarm();

            //Find AlarmTypeId
            var alarmTypeId = (await _context.AlarmTypes.FirstOrDefaultAsync<AlarmType>(c => c.AlarmName == alarmType.AlarmTypeName)).AlarmTypeId;

            //Update Response
            alarmTypeResponse.AMRMeterAlarmId = alarmType.AMRMeterAlarmId;
            alarmTypeResponse.AlarmTypeId = alarmTypeId;
            alarmTypeResponse.AMRMeterId = alarmType.AMRMeterId;
            alarmTypeResponse.AlarmTriggerMethodId = alarmType.AlarmTriggerMethodId;
            alarmTypeResponse.Threshold = alarmType.Threshold;
            alarmTypeResponse.Duration = alarmType.Duration;
            alarmTypeResponse.StartTime = alarmType.StartTime;
            alarmTypeResponse.EndTime = alarmType.EndTime;
            alarmTypeResponse.Active = alarmType.Active;

            if (alarmTypeResponse.AMRMeterAlarmId == 0) //Create
            {
                _context.AMRMeterAlarms.Add(alarmTypeResponse);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully Created AMRMeterAlarm with ID: {alarmTypeResponse.AMRMeterAlarmId}");
                return CreatedAtAction("CreateOrUpdateAMRMeterAlarm", new { id = alarmTypeResponse.AMRMeterAlarmId }, alarmTypeResponse);
            }
            else                         //Update
            {
                _context.Entry(alarmTypeResponse).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Successfully Updated AMRMeterAlarm with ID: {alarmTypeResponse.AMRMeterAlarmId}");
                    return CreatedAtAction("CreateOrUpdateAMRMeterAlarm", new { id = alarmTypeResponse.AMRMeterAlarmId }, alarmTypeResponse);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AMRMeterAlarmExists(alarmTypeResponse.AMRMeterAlarmId))
                    {
                        _logger.LogError($"AMRMeterAlarm With Id: {alarmTypeResponse.AMRMeterAlarmId} does not exist!");
                        return NotFound();
                    }
                    else
                    {
                        _logger.LogError($"Database Confirmation on AMRMeterAlarm does exist and was Updated!");
                        return NoContent();
                    }
                }
            }
        }

        // POST: AMRMeterAlarms
        [HttpPost("createOrUpdateAMRMeterAlarmById")]
        public async Task<ActionResult<AMRMeterAlarm>> CreateOrUpdateAMRMeterAlarmByAlarmTypeId(AMRMeterAlarm alarmType)
        {
            if (_context.AMRMeterAlarms == null)
            {
                return Problem("Entity set 'PortalDBContext.AMRMeterAlarms'  is null.");
            }
            if (alarmType.AMRMeterAlarmId == 0) //Create
            {
                _context.AMRMeterAlarms.Add(alarmType);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully Created AMRMeterAlarm with ID: {alarmType.AMRMeterAlarmId}");
                return CreatedAtAction("CreateOrUpdateAMRMeterAlarm", new { id = alarmType.AMRMeterAlarmId }, alarmType);
            }
            else                         //Update
            {
                _context.Entry(alarmType).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Successfully Updated AMRMeterAlarm with ID: {alarmType.AMRMeterAlarmId}");
                    return CreatedAtAction("CreateOrUpdateAMRMeterAlarm", new { id = alarmType.AMRMeterAlarmId }, alarmType);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AMRMeterAlarmExists(alarmType.AMRMeterAlarmId))
                    {
                        _logger.LogError($"AMRMeterAlarm With Id: {alarmType.AMRMeterAlarmId} does not exist!");
                        return NotFound();
                    }
                    else
                    {
                        _logger.LogError($"Database Confirmation on AMRMeterAlarm does exist and was Updated!");
                        return NoContent();
                    }
                }
            }
        }

        // DELETE: AMRMeterAlarms/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAMRMeterAlarm(int id)
        {
            if (_context.AMRMeterAlarms == null)
            {
                _logger.LogError($"AMRMeterAlarm With Id: {id} does not exist!");
                return NotFound();
            }
            var alarmType = await _context.AMRMeterAlarms.FindAsync(id);
            if (alarmType == null)
            {
                _logger.LogError($"AMRMeterAlarm With Id: {id} does not exist!");
                return NotFound();
            }

            _context.AMRMeterAlarms.Remove(alarmType);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully Deleted AMRMeterAlarm with ID: {alarmType.AMRMeterAlarmId}");
            return NoContent();
        }

        private bool AMRMeterAlarmExists(int id)
        {
            return (_context.AMRMeterAlarms?.Any(e => e.AMRMeterAlarmId == id)).GetValueOrDefault();
        }
    }
}
