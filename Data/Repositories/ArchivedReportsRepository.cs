using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Data.Repositories
{
    public interface IArchivedReportsRepository : IRepository<ArchivedReport>
    {
        public Task<List<ArchivedReport>> GetArchivedReportsForBuildings(List<int> buildingIds);
    }
    public class ArchivedReportsRepository : RepositoryBase<ArchivedReport, PortalDBContext>, IArchivedReportsRepository
    {
        public ArchivedReportsRepository(ILogger<ArchivedReportsRepository> logger, PortalDBContext context) : base(logger, context)
        {
        }

        public async Task<List<ArchivedReport>> GetArchivedReportsForBuildings(List<int> buildingIds)
        {
            return await GetAllAsync(x => buildingIds.Contains(x.BuildingId) && x.Active);
        }
    }
}
