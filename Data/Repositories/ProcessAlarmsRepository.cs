using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public class ProcessAlarmsRepository
    {
        private readonly ILogger<ProcessAlarmsRepository> _logger;
        private readonly PortalDBContext _context;

        public ProcessAlarmsRepository(ILogger<ProcessAlarmsRepository> logger, PortalDBContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IEnumerable<AMRMeterAlarm>> GetAlarmsToProcess()
        {
            try
            {
                _logger.LogInformation("Retrieving alarms to process from database...");
                var ret = await _context.AMRMeterAlarms
                    .Where(ma => ma.LastRunDTM == null || ma.LastRunDTM < DateTime.Now.AddMinutes(-60))
                    .ToListAsync();

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting alarms to process: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> ProcessNightFlow(AMRMeterAlarm alarm)
        {
            try
            {
                alarm.LastRunDTM = DateTime.Now;
                
                var meterSerial = (await _context.AMRMeters.FindAsync(alarm.AMRMeterId)).MeterSerial;
                DateTime? lastProfileData = (await _context.ScadaProfileData.Where(p => p.SerialNumber == meterSerial)
                    .Select(p => p.ReadingDate)
                    .MaxAsync());
                if (!lastProfileData.HasValue)
                {
                    _logger.LogError($"No Profile data for meter {meterSerial}");
                    return false; 
                }
                DateTime lastAlarmData = alarm.LastDataDTM?? lastProfileData?.AddHours(-24) ?? DateTime.Now.AddHours(-24);

                alarm.LastDataDTM = lastProfileData;

                _context.Update<AMRMeterAlarm>(alarm);
                if ((await _context.SaveChangesAsync()) == 0)
                {
                    _logger.LogError($"Update of alarm run date failed for alarm : {alarm.AMRMeterAlarmId}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while processing nightflow alarm {alarm.AMRMeterAlarmId}: {ex.Message}");
                return false;
            }
        }
    }
}
