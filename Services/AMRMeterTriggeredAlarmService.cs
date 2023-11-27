using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ServiceStack;

namespace ClientPortal.Services
{
    public interface IAMRMeterTriggeredAlarmService
    {
        Task<AMRMeterTriggeredAlarm> AcknowledgeAlarmAsync(AMRMeterTriggeredAlarmAcknowledgeRequest acknowledgement, int id);
        Task<AlarmTriggeredSpResponse> GetTriggeredAlarmAsync(int amrMeterTriggeredAlarmId);
        public int? GetNotAcknowledgedTriggeredAlarmsCount(int amrMeterId);

        Task<List<AMRMeterTriggeredAlarmInfo>> GetTriggeredAlarmsAsync(AMRTriggeredAlarmsRequest request);
        Task<List<AlarmsPerBuildingEntry>> GetAlarmsPerBuildingAsync();
    }
    public class AMRMeterTriggeredAlarmService : IAMRMeterTriggeredAlarmService
    {
        private readonly ILogger<AMRMeterTriggeredAlarmService> _logger;
        private readonly IAMRMeterTriggeredAlarmRepository _repository;
        private readonly IUMFABuildingRepository _umfaBuildingRepository;
        private readonly IPortalSpRepository _portalSpRepository;

        public AMRMeterTriggeredAlarmService(ILogger<AMRMeterTriggeredAlarmService> logger, IAMRMeterTriggeredAlarmRepository repository, IUMFABuildingRepository umfaBuildingRepository, IPortalSpRepository portalSpRepository)
        {
            _logger = logger;
            _repository = repository;
            _umfaBuildingRepository = umfaBuildingRepository;
            _portalSpRepository = portalSpRepository;
        }

        public async Task<AMRMeterTriggeredAlarm> AcknowledgeAlarmAsync(AMRMeterTriggeredAlarmAcknowledgeRequest acknowledgement, int id)
        {
            var alarm = await _repository.GetAsync(id);
            alarm.Acknowledged = (bool)acknowledgement.Acknowledged!;

            var updatedAlarm = await _repository.UpdateAsync(alarm);

            return updatedAlarm;
        }

        public async Task<AlarmTriggeredSpResponse> GetTriggeredAlarmAsync(int amrMeterTriggeredAlarmId)
        {
            return await _repository.RunStoredProcedureAsync<AlarmTriggeredSpResponse, AMRMeterTriggeredAlarmSpRequest>("spGetTriggeredAlarm", new AMRMeterTriggeredAlarmSpRequest { AlarmTriggerId = amrMeterTriggeredAlarmId });
        }


        public int? GetNotAcknowledgedTriggeredAlarmsCount(int amrMeterId)
        {
            return _repository.Count(x => x.AMRMeterAlarmId.Equals(amrMeterId) && !x.Acknowledged && x.Active);
        }

        public async Task<List<AMRMeterTriggeredAlarmInfo>> GetTriggeredAlarmsAsync(AMRTriggeredAlarmsRequest request)
        {
            var alarms =  _repository.GetAMRTriggeredAlarms(request);
            var buildingIds = (await _umfaBuildingRepository.GetBuildings((int)request.UmfaUserId!)).UmfaBuildings.Select(b => b.BuildingId);

            return alarms.Where(a => buildingIds.Contains(a.BuildingUmfaId)).ToList();
        }

        public async Task<List<AlarmsPerBuildingEntry>> GetAlarmsPerBuildingAsync()
        {
            return (await _portalSpRepository.GetAlarmsPerBuildingAsync()).Entries;
        }
    }
}
