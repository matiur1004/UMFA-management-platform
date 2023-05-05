using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ProcessAlarmsModels;
using Dapper;
using DevExpress.DataAccess.Native.Web;

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

                if (lastAlarmData >= lastProfileData?.AddHours(-1))
                {
                    _logger.LogError($"Not time to run yet...");
                    return false;
                }

                lastAlarmData = DateTime.Parse("2023-03-05 00:00:00");
                lastProfileData = DateTime.Parse("2023-03-06 00:00:00");

                var CommandText = $"exec spAlarmAnalyzeNightFlow '{meterSerial}', '{lastAlarmData.ToString("yyyy-MM-dd HH:mm")}', '{lastProfileData?.ToString("yyyy-MM-dd HH:mm")}'";
                CommandText += $", '{alarm.StartTime}', '{alarm.EndTime}', {alarm.Threshold}, {alarm.Duration}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                List<ProcessAlarmsProfile> profile = new();
                ProcessAlarmsTriggered triggered = new() { NoOfAlarms = 0 };

                using (var results = await connection.QueryMultipleAsync(CommandText))
                {
                    if (results == null)
                    {
                        _logger.LogError($"Not time to run yet...");
                        return false;
                    }

                    profile = (await results.ReadAsync<ProcessAlarmsProfile>()).ToList();
                    triggered = (await results.ReadAsync<ProcessAlarmsTriggered>()).FirstOrDefault();
                }

                if (triggered.NoOfAlarms > 0)
                {
                    DateTime occStart = profile.Where(p => p.Color == "red").Min(p => p.ReadingDate);
                    DateTime occEnd = profile.Where(p => p.Color == "red").Max(p => p.ReadingDate);
                    decimal avgObserved = profile.Where(p => p.Color == "red").Average(p => p.ActFlow);
                    decimal maxObserved = profile.Where(p => p.Color == "red").Max(p => p.ActFlow);
                    AMRMeterTriggeredAlarm trigAlarm = new()
                    {
                        AMRMeterAlarmId = alarm.AMRMeterAlarmId,
                        OccStartDTM = occStart,
                        OccEndDTM = occEnd,
                        Threshold = (decimal)alarm.Threshold,
                        Duration = alarm.Duration,
                        AverageObserved = avgObserved,
                        MaximumObserved = maxObserved,
                        CreatedDTM = DateTime.Now,
                        UpdatedDTM = DateTime.Now,
                        Acknowledged = false,
                        Active = true
                    };

                    _context.Add( trigAlarm );
                }

                alarm.LastDataDTM = lastProfileData;
                _context.Update<AMRMeterAlarm>(alarm);
                if ((await _context.SaveChangesAsync()) == 0)
                {
                    _logger.LogError($"Applying Processing changes failed for alarm : {alarm.AMRMeterAlarmId}");
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
