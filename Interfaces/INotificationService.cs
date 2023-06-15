using ClientPortal.Models.MessagingModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;

namespace ClientPortal.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationsToSendSpResponse> GetNotificationsToSendAsync();
        Task SendPendingNotifications();
    }
}


