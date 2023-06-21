using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Interfaces
{
    public interface IWhatsAppService
    {
        Task<bool> SendPortalAlarmAsync(WhatsAppData wData, CancellationToken ct);
    }
}