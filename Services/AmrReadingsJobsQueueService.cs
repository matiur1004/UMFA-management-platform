using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IAmrReadingsJobsQueueService : IQueueService { }
    public class AmrReadingsJobsQueueService : QueueService<AmrReadingsJobsQueueSettings>, IAmrReadingsJobsQueueService
    {
        public AmrReadingsJobsQueueService(IOptions<AmrReadingsJobsQueueSettings> settings) : base(settings) { }
    }
}
