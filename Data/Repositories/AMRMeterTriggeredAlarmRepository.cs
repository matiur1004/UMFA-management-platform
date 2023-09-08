using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Data.Repositories
{
    public interface IAMRMeterTriggeredAlarmRepository : IRepository<AMRMeterTriggeredAlarm>
    {
        List<AMRMeterTriggeredAlarmInfo> GetAMRTriggeredAlarms(AMRTriggeredAlarmsRequest request);
    }

    public class AMRMeterTriggeredAlarmRepository : RepositoryBase<AMRMeterTriggeredAlarm, PortalDBContext>, IAMRMeterTriggeredAlarmRepository
    {
        private readonly ILogger<AMRMeterTriggeredAlarmRepository> _logger;
        private readonly PortalDBContext _context;
        public AMRMeterTriggeredAlarmRepository(ILogger<AMRMeterTriggeredAlarmRepository> logger, PortalDBContext context) : base(logger, context)
        {
            _context = context;
            _logger = logger;
        }

        public List<AMRMeterTriggeredAlarmInfo> GetAMRTriggeredAlarms(AMRTriggeredAlarmsRequest request)
        {
            var result = _context.AMRMeterTriggeredAlarms
            .Where(ta => !ta.Acknowledged && ta.Active)
            .Join(_context.AMRMeterAlarms, ta => ta.AMRMeterAlarmId, ma => ma.AMRMeterAlarmId, (ta, ma) => new { ta, ma })
            .Join(_context.AlarmTypes, combined => combined.ma.AlarmTypeId, at => at.AlarmTypeId, (combined, at) => new { combined.ta, combined.ma, at })
            .Join(_context.AMRMeters, combined => combined.ma.AMRMeterId, m => m.Id, (combined, m) => new { combined.ta, combined.ma, combined.at, m })
            .Join(_context.Buildings, combined => combined.m.BuildingId, b => b.UmfaId, (combined, b) => new AMRMeterTriggeredAlarmInfo
            {
                AMRMeterTriggeredAlarmId = combined.ta.AMRMeterTriggeredAlarmId,
                Partner = b.Partner,
                Building = b.Name,
                BuildingUmfaId = b.UmfaId,
                MeterNo = combined.m.MeterNo,
                MeterSerial = combined.m.MeterSerial,
                Description = combined.m.Description,
                AlarmName = combined.at.AlarmName,
                AlarmDescription = combined.at.AlarmDescription,
                OccStartDTM = combined.ta.OccStartDTM,
                Threshold = combined.ta.Threshold,
                Duration = combined.ta.Duration,
                AverageObserved = combined.ta.AverageObserved,
                MaximumObserved = combined.ta.MaximumObserved
            });

            if(request.UmfaBuildingId != 0)
            {
                result = result.Where(result => result.BuildingUmfaId.Equals(request.UmfaBuildingId));
            }

            return result.ToList();
        }
    }
}
