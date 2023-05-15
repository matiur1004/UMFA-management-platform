using ClientPortal.Models.MessagingModels;
using ClientPortal.Services;

namespace ClientPortal.Interfaces
{
    public interface INotificationService
    {
        Task<bool> ProcessNotifications();
    }
}


