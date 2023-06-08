using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public class ScadaRequestDetailRepository : RepositoryBase<ScadaRequestDetail, PortalDBContext>, IScadaRequestRepository<ScadaRequestDetail>
    {
        public ScadaRequestDetailRepository(ILogger<ScadaRequestDetailRepository> logger, PortalDBContext portalDBContext) : base(logger, portalDBContext)
        {

        }
    }
}
