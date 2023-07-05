using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IArchiveRequestDetailRepository : IRepository<ArchiveRequestDetail>
    {
    }
    public class ArchiveRequestDetailRepository : RepositoryBase<ArchiveRequestDetail, PortalDBContext>, IArchiveRequestDetailRepository
    {
        public ArchiveRequestDetailRepository(ILogger<ArchiveRequestDetailRepository> logger, PortalDBContext context) : base(logger, context)
        {
        }
    }
}
