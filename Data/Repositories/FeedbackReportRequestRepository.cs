using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IFeedbackReportRequestRepository : IRepository<FeedbackReportRequest>
    {
    }
    
    public class FeedbackReportRequestRepository : RepositoryBase<FeedbackReportRequest, PortalDBContext>, IFeedbackReportRequestRepository
    {
        public FeedbackReportRequestRepository(ILogger<FeedbackReportRequestRepository> logger, PortalDBContext context) : base(logger, context)
        {
        }
    }
}
