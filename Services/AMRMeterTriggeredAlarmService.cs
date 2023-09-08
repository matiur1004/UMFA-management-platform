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
        Task<AlarmTriggeredSpResponse> GetTriggeredAlarm(int amrMeterTriggeredAlarmId);
        public int? GetNotAcknowledgedTriggeredAlarmsCount(int amrMeterId);

        Task<List<AMRMeterTriggeredAlarmInfo>> GetTriggeredAlarms(AMRTriggeredAlarmsRequest request);
    }
    public class AMRMeterTriggeredAlarmService : IAMRMeterTriggeredAlarmService
    {
        private readonly ILogger<AMRMeterTriggeredAlarmService> _logger;
        private readonly IAMRMeterTriggeredAlarmRepository _repository;
        private readonly IUMFABuildingRepository _umfaBuildingRepository;

        public AMRMeterTriggeredAlarmService(ILogger<AMRMeterTriggeredAlarmService> logger, IAMRMeterTriggeredAlarmRepository repository, IUMFABuildingRepository umfaBuildingRepository)
        {
            _logger = logger;
            _repository = repository;
            _umfaBuildingRepository = umfaBuildingRepository;
        }

        public async Task<AMRMeterTriggeredAlarm> AcknowledgeAlarmAsync(AMRMeterTriggeredAlarmAcknowledgeRequest acknowledgement, int id)
        {
            var alarm = await _repository.GetAsync(id);
            alarm.Acknowledged = (bool)acknowledgement.Acknowledged!;

            var updatedAlarm = await _repository.UpdateAsync(alarm);

            return updatedAlarm;
        }

        public async Task<AlarmTriggeredSpResponse> GetTriggeredAlarm(int amrMeterTriggeredAlarmId)
        {
            return await _repository.RunStoredProcedureAsync<AlarmTriggeredSpResponse, AMRMeterTriggeredAlarmSpRequest>("spGetTriggeredAlarm", new AMRMeterTriggeredAlarmSpRequest { AlarmTriggerId = amrMeterTriggeredAlarmId });
        }


        public int? GetNotAcknowledgedTriggeredAlarmsCount(int amrMeterId)
        {
            return _repository.Count(x => x.AMRMeterAlarmId.Equals(amrMeterId) && !x.Acknowledged && x.Active);
        }

        public async Task<List<AMRMeterTriggeredAlarmInfo>> GetTriggeredAlarms(AMRTriggeredAlarmsRequest request)
        {
            var alarms =  _repository.GetAMRTriggeredAlarms(request);
            var buildingIds = (await _umfaBuildingRepository.GetBuildings((int)request.UmfaUserId!)).UmfaBuildings.Select(b => b.BuildingId);

            return alarms.Where(a => buildingIds.Contains(a.BuildingUmfaId)).ToList();
        }
    }
}
