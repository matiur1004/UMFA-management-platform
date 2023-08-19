using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IArchivesQueueService : IQueueService
    {

    }
    public class ArchivesQueueService : QueueService<ArchivesQueueSettings>, IArchivesQueueService
    {
        public ArchivesQueueService(IOptions<ArchivesQueueSettings> settings) : base(settings) { }
    }
}
