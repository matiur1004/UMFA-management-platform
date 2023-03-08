using ClientPortal.Models.MailModels;

namespace ClientPortal.Interfaces
{
    public interface IMailService
    {
        Task<bool> SendAsync(MailData mailData, CancellationToken ct);

        Task<bool> SendWithAttachmentsAsync(MailDataWithAttachments mailData, CancellationToken ct);
       
    }
}
