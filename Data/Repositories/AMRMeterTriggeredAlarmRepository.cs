using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IAMRMeterTriggeredAlarmRepository : IRepository<AMRMeterTriggeredAlarm>
    {
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
    }
}
