using ClientPortal.Interfaces;
using ClientPortal.Models.MessagingModels;
using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationSettings _settings;
        public NotificationService(IOptions<NotificationSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<bool> SendAsync(NotificationData tData, CancellationToken ct = default)
        {
            var returnUrl = _settings.ReturnBaseUrl;
            return true;
        }
    }

    public class NotificationData
    {

    }
}

