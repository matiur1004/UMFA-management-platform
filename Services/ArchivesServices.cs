using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;

namespace ClientPortal.Services
{
    public interface IArchivesServices
    {
        public Task<int> CreateArhiveRequestEntriesAsync(List<ArchiveReportsRequest> reports);
    }
    public class ArchivesServices : IArchivesServices
    {
        private readonly ILogger<ArchivesServices> _logger;
        private readonly IArchiveRequestDetailRepository _archiveRequestDetailRepository;
        private readonly IArchiveRequestHeaderRepository _archiveRequestHeaderRepository;

        public ArchivesServices(ILogger<ArchivesServices> logger, IArchiveRequestDetailRepository archiveRequestDetailRepository, IArchiveRequestHeaderRepository archiveRequestHeaderRepository)
        {
            _logger = logger;
            _archiveRequestDetailRepository = archiveRequestDetailRepository;
            _archiveRequestHeaderRepository = archiveRequestHeaderRepository;
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
    }
}
