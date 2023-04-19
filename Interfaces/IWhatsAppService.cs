using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Interfaces
{
    public interface IWhatsAppService
    {
        Task<bool> SendAsync(WhatsAppData whatsAppData, CancellationToken ct);

    }
}
