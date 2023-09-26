using ClientPortal.Settings;
using Microsoft.Extensions.Options;

namespace ClientPortal.Services
{
    public interface IArchivesContainerService : IContainerService { }
    public class ArchivesContainerService : ContainerService<ArchiveContainerSettings>, IArchivesContainerService
    {
        public ArchivesContainerService(ILogger<ArchivesContainerService> logger, IOptions<ArchiveContainerSettings> settings) : base(logger, settings) { }
    }
}
