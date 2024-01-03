using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IClientFeedbackReportRequestRepository : IRepository<ClientFeedbackReportRequest>
    {
    }

    public class ClientFeedbackReportRequestRepository : RepositoryBase<ClientFeedbackReportRequest, PortalDBContext>, IClientFeedbackReportRequestRepository
    {
        public ClientFeedbackReportRequestRepository(ILogger<ClientFeedbackReportRequestRepository> logger, PortalDBContext context) : base(logger, context)
        {
        }
    }

}
