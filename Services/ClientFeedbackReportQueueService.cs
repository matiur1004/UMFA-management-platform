using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IClientFeedbackReportQueueService : IQueueService { }
    public class ClientFeedbackReportQueueService : QueueService<ClientFeedbackReportQueueSettings>, IClientFeedbackReportQueueService
    {
        public ClientFeedbackReportQueueService(IOptions<ClientFeedbackReportQueueSettings> settings) : base(settings) { }
    }
}
