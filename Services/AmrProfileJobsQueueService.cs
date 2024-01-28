using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IAmrProfileJobsQueueService : IQueueService { }
    public class AmrProfileJobsQueueService : QueueService<AmrProfileJobsQueueSettings>, IAmrProfileJobsQueueService
    {
        public AmrProfileJobsQueueService(IOptions<AmrProfileJobsQueueSettings> settings) : base(settings) { }
    }
}
