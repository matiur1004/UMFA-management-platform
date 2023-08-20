using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IFeedbackReportContainerService : IContainerService { }

    public class FeedbackReportContainerService : ContainerService<FeedbackReportContainerSettings>, IFeedbackReportContainerService
    {
        public FeedbackReportContainerService(ILogger<FeedbackReportContainerService> logger, IOptions<FeedbackReportContainerSettings> settings) : base(logger, settings) { }
    }
}
