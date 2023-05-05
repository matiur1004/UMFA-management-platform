using ClientPortal.Models.MessagingModels;

namespace ClientPortal.Interfaces
{
    public interface IMailService
    {
        Task<bool> SendAsync(MailData mData, CancellationToken ct);
    }
}