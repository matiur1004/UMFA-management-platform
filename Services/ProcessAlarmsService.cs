using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;

namespace ClientPortal.Services
{
    public class ProcessAlarmsService
    {
        private readonly ILogger<ProcessAlarmsService> _logger;
        private readonly ProcessAlarmsRepository _repo;

        public ProcessAlarmsService(ILogger<ProcessAlarmsService> logger, ProcessAlarmsRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }

        public async Task<bool> ProcessAlarms()
        {
            try
            {
                bool ret = false;
                _logger.LogInformation("Calling repo for alarms...");
                var alarms = await _repo.GetAlarmsToProcess();
                if (alarms == null)
                {
                    _logger.LogInformation("No Alarms to process");
                }
                else
                {
                    var nightFlow = alarms.Where(a => a.AlarmTypeId == 1).ToList();
                    if (nightFlow != null && nightFlow.Count > 0)
                        ret = ProcessNightFlowAlarms(nightFlow);
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while Processing alarms: {ex.Message}");
                throw;
            }
        }

        private bool ProcessNightFlowAlarms(List<AMRMeterAlarm> alarms)
        {
            try
            {
                _logger.LogInformation("Now processing nightflow alarms...");
                foreach (var alarm in alarms)
                {
                    _ = _repo.ProcessNightFlow(alarm).GetAwaiter().GetResult();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while processing nightflow alarms: {ex.Message}");
                return false;
            }
        }
    }
}
