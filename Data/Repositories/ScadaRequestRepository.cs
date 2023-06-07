using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IScadaRequestRepository<T> : IRepository<T>
    {
    }

    public class ScadaRequestRepository : RepositoryBase<ScadaRequestHeader, PortalDBContext>, IScadaRequestRepository<ScadaRequestHeader>
    {
        public ScadaRequestRepository(ILogger<ScadaRequestRepository> logger, PortalDBContext portalDBContext) : base(logger, portalDBContext)
        {

        }
    }
}
