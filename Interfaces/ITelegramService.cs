using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Interfaces
{
    public interface ITelegramService
    {        
        Task<bool> SendAsync(TelegramData tData, CancellationToken ct);
    }
}