using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IAMRMeterTriggeredAlarmService
    {
        Task<AMRMeterTriggeredAlarm> AcknowledgeAlarmAsync(AMRMeterTriggeredAlarmAcknowledgeRequest acknowledgement, int id);
        Task<AlarmTriggeredSpResponse> GetTriggeredAlarms(int amrMeterTriggeredAlarmId);
    }
    public class AMRMeterTriggeredAlarmService : IAMRMeterTriggeredAlarmService
    {
        private readonly ILogger<AMRMeterTriggeredAlarmService> _logger;
        private readonly IAMRMeterTriggeredAlarmRepository _repository;
        
        public AMRMeterTriggeredAlarmService(ILogger<AMRMeterTriggeredAlarmService> logger, IAMRMeterTriggeredAlarmRepository repository) 
        {
            _logger = logger;
            _repository = repository;
        }

        public async Task<AMRMeterTriggeredAlarm> AcknowledgeAlarmAsync(AMRMeterTriggeredAlarmAcknowledgeRequest acknowledgement, int id) 
        {
            var alarm = await _repository.GetAsync(id);
            alarm.Acknowledged = (bool)acknowledgement.Acknowledged!;

            var updatedAlarm = await _repository.UpdateAsync(alarm);

            return updatedAlarm;
        }

        public async Task<AlarmTriggeredSpResponse> GetTriggeredAlarms(int amrMeterTriggeredAlarmId)
        {
            return await _repository.RunStoredProcedureAsync<AlarmTriggeredSpResponse, AMRMeterTriggeredAlarmSpRequest>("spGetTriggeredAlarm", new AMRMeterTriggeredAlarmSpRequest { AlarmTriggerId = amrMeterTriggeredAlarmId});
        }

    }
}
