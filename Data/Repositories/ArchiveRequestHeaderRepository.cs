using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IArchiveRequestHeaderRepository : IRepository<ArchiveRequestHeader>
    {
    }
    public class ArchiveRequestHeaderRepository : RepositoryBase<ArchiveRequestHeader, PortalDBContext>, IArchiveRequestHeaderRepository
    {
        public ArchiveRequestHeaderRepository(ILogger<ArchiveRequestHeaderRepository> logger, PortalDBContext context) : base(logger, context)
        {
        }
    }
}
