using ClientPortal.Models.MessagingModels;
using ClientPortal.Services;

namespace ClientPortal.Interfaces
{
    public interface INotificationService
    {
        Task<bool> SendAsync(NotificationData nData, CancellationToken ct);
    }
}


