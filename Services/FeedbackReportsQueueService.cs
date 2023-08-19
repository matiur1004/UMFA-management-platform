using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IFeedbackReportsQueueService : IQueueService{ }
    public class FeedbackReportsQueueService: QueueService<FeedbackReportQueueSettings>, IFeedbackReportsQueueService
    {
        public FeedbackReportsQueueService(IOptions<FeedbackReportQueueSettings> settings) : base(settings) { }
    }
}
