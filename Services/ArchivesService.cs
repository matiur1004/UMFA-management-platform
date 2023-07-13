using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Helpers;
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
        private readonly IUmfaRepository _umfaRepository;
        public ArchivesService(
            ILogger<ArchivesService> logger, 
            IArchiveRequestDetailRepository archiveRequestDetailRepository, 
            IArchiveRequestHeaderRepository archiveRequestHeaderRepository, 
            IArchivedReportsRepository archivedReportsRepository, 
            IUMFABuildingRepository umfaBuildingRepository, 
            IUmfaRepository umfaRepository)
        {
            _logger = logger;
            _archiveRequestDetailRepository = archiveRequestDetailRepository;
            _archiveRequestHeaderRepository = archiveRequestHeaderRepository;
            _archivedReportsRepository = archivedReportsRepository;
            _umfaBuildingRepository = umfaBuildingRepository;
            _umfaRepository = umfaRepository;
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
                var fileFormatData = await _umfaRepository.GetFileFormatData(new FileFormatDataSpRequest
                {
                    ShopId = (int)report.ShopId!,
                    BuildingId = header.BuildingId!,
                    PeriodId = (int)report.PeriodId!,
                    ReportTypeId = (int)report.ReportTypeId!,
                    TenantId = (int)report.TenantId!
                });

                report.FileName = FileFormatHelper.TranslateFileFormat(report.FileFormat.FileNameFormat, fileFormatData.FilesFormatData[0]);

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
