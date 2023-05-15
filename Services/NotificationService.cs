using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationSettings _settings;
        private readonly PortalDBContext _dbContext;

        public NotificationService(IOptions<NotificationSettings> settings, PortalDBContext dBContext)
        {
            _settings = settings.Value;
            _dbContext = dBContext;
        }

        public async Task<bool> SendAsync(NotificationData tData, CancellationToken ct = default)
        {
            var returnUrl = _settings.ReturnBaseUrl;
            var triggeredAlarmNotifications = new List<TriggeredAlarmNotification>();
            var notificationsToSend = _dbContext.TriggeredAlarmNotifications.Where(a => a.Status == 1 && a.Active == true);

            return true;
        }
    }

    public class NotificationData
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Type { get; set; }

    }
}

