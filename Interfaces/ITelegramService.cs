using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Interfaces
{
    public interface ITelegramService
    {        
        Task<string> SendAsync(TelegramData tData, CancellationToken ct);
    }
}