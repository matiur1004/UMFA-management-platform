using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public class ScadaRequestHeaderRepository : RepositoryBase<ScadaRequestHeader, PortalDBContext>, IScadaRequestRepository<ScadaRequestHeader>
    {
        public ScadaRequestHeaderRepository(ILogger<ScadaRequestHeaderRepository> logger, PortalDBContext portalDBContext) : base(logger, portalDBContext)
        {

        }
    }
}
