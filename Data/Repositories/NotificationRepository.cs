using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ResponseModels;
using Dapper;
using Newtonsoft.Json;

namespace ClientPortal.Data.Repositories
{
    public interface INotificationRepository : IRepository<TriggeredAlarmNotification>
    {
        public Task<NotificationsToSendSpResponse> GetNotificationsToSendAsync();
    }
    public class NotificationRepository : RepositoryBase<TriggeredAlarmNotification, PortalDBContext>, INotificationRepository
    {

        private readonly ILogger<NotificationRepository> _logger;
        private readonly PortalDBContext _context;

        public NotificationRepository(ILogger<NotificationRepository> logger, PortalDBContext context) : base(logger, context)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<NotificationsToSendSpResponse> GetNotificationsToSendAsync()
        {
            return await RunStoredProcedure<NotificationsToSendSpResponse>("spGetNotificationsToSend");
        }
    }
}
