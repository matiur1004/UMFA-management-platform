using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;

namespace ClientPortal.Services
{
    public interface IArchivesService
    {
        public Task<int> CreateArhiveRequestEntriesAsync(List<ArchiveReportsRequest> reports);
        public Task<List<ArchivedReport>> GetArchivedReportsForUserAsync(int umfaUserId);

        public Task<ArchiveRequestHeader> GetArchiveRequestHeaderAsync(int id);
        public Task<List<ArchiveRequestDetail>> GetArchiveRequestDetailsByHeaderIdAsync(int id);

        public Task<ArchivedReport> AddArchivedReportAsync(ArchivedReport report);
    }
    public class ArchivesService : IArchivesService
    {
        private readonly ILogger<ArchivesService> _logger;
        private readonly IArchiveRequestDetailRepository _archiveRequestDetailRepository;
        private readonly IArchiveRequestHeaderRepository _archiveRequestHeaderRepository;
        private readonly IArchivedReportsRepository _archivedReportsRepository;
        private readonly IUMFABuildingRepository _umfaBuildingRepository;
        public ArchivesService(ILogger<ArchivesService> logger, IArchiveRequestDetailRepository archiveRequestDetailRepository, IArchiveRequestHeaderRepository archiveRequestHeaderRepository, IArchivedReportsRepository archivedReportsRepository, IUMFABuildingRepository umfaBuildingRepository)
        {
            _logger = logger;
            _archiveRequestDetailRepository = archiveRequestDetailRepository;
            _archiveRequestHeaderRepository = archiveRequestHeaderRepository;
            _archivedReportsRepository = archivedReportsRepository;
            _umfaBuildingRepository = umfaBuildingRepository;
        }

        public async Task<int> CreateArhiveRequestEntriesAsync(List<ArchiveReportsRequest> reports)
        {
            // create header
            var header = new ArchiveRequestHeader(reports.First());
            header = await _archiveRequestHeaderRepository.AddAsync(header);
            
            // create details
            var details = new List<ArchiveRequestDetail>();

            foreach (var report in reports)
            {
                details.Add(new ArchiveRequestDetail(report, header.ArchiveRequestId));
            }

            try
            {
                await _archiveRequestDetailRepository.AddRangeAsync(details);
            }
            catch (Exception e) 
            {
                _logger.LogError(e, "Could not add archive request details");
            }

            return header.ArchiveRequestId;
        }
        
        public async Task<List<ArchivedReport>> GetArchivedReportsForUserAsync(int umfaUserId)
        {
            var buildingsResponse = await _umfaBuildingRepository.GetBuildings(umfaUserId);

            if(buildingsResponse.UmfaBuildings is null)
            {
                return null;
            }
            else if(!buildingsResponse.UmfaBuildings.Any())
            {
                return new List<ArchivedReport>();
            }

            return await _archivedReportsRepository.GetArchivedReportsForBuildings(buildingsResponse.UmfaBuildings.Select(b => b.BuildingId).ToList());
        }

        public async Task<ArchiveRequestHeader> GetArchiveRequestHeaderAsync(int id)
        {
            return await _archiveRequestHeaderRepository.GetAsync(id);
        }

        public async Task<List<ArchiveRequestDetail>> GetArchiveRequestDetailsByHeaderIdAsync(int id)
        {
            return await _archiveRequestDetailRepository.GetAllAsync(ad => ad.ArchiveRequestId.Equals(id));
        }

        public async Task<ArchivedReport> AddArchivedReportAsync(ArchivedReport report)
        {
            return await _archivedReportsRepository.AddAsync(report);
        }
    }
}
