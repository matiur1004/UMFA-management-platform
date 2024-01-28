using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Helpers;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ServiceStack;

namespace ClientPortal.Services
{
    public interface IScadaRequestService
    {
        public Task<List<ScadaRequestHeaderResponse>> GetScadaRequestHeadersAsync();
        public Task<ScadaRequestHeader> GetScadaRequestHeaderAsync(int id);
        public Task<ScadaRequestHeader> UpdateScadaRequestHeaderAsync(ScadaRequestHeaderUpdateRequest scadaRequestHeader);
        public Task<ScadaRequestHeader> AddScadaRequestHeaderAsync(ScadaRequestHeaderRequest scadaRequestHeader);
        public Task<ScadaRequestHeader> RemoveScadaRequestHeaderAsync(int id);
        public Task<ScadaRequestHeader> GetScadaRequestHeaderByJobTypeAndDescriptionAsync(int jobType, string description);
        public Task<ScadaRequestHeader> GetOrCreateScadaRequestHeaderDefaultAsync(int jobType, DateTime now);
        public Task HandleNewMappedMeterAsync(MappedMeter meter, int meterId);

        public Task<List<ScadaRequestDetail>> GetScadaRequestDetailsAsync();
        public Task<ScadaRequestDetail> GetScadaRequestDetailAsync(int id);
        public Task<ScadaRequestDetail> GetScadaRequestDetailAsyncByJobTypeAndAmrMeterIdAsync(int jobType, int amrMeterId);
        public Task<ScadaRequestDetail> UpdateScadaRequestDetailAsync(ScadaRequestDetailUpdateRequest scadaRequestDetail);
        public Task<ScadaRequestDetail> AddScadaRequestDetailAsync(ScadaRequestDetailRequest scadaRequestDetail);
        public Task<ScadaRequestDetail> RemoveScadaRequestDetailAsync(int id);
    }
    public class ScadaRequestService : IScadaRequestService
    {
        private readonly ILogger<ScadaRequestService> _logger;
        private readonly IScadaRequestRepository<ScadaRequestHeader> _scadaRequestHeaderRepo;
        private readonly IScadaRequestRepository<ScadaRequestDetail> _scadaRequestDetailRepo;

        public ScadaRequestService(ILogger<ScadaRequestService> logger,
            IScadaRequestRepository<ScadaRequestHeader> scadaRequestHeaderRepo,
            IScadaRequestRepository<ScadaRequestDetail> scadaRequestDetailRepo)
        {
            _logger = logger;
            _scadaRequestHeaderRepo = scadaRequestHeaderRepo;
            _scadaRequestDetailRepo = scadaRequestDetailRepo;
        }

        #region Headers
        public async Task<ScadaRequestHeader> GetScadaRequestHeaderAsync(int id)
        {
            return await _scadaRequestHeaderRepo.GetAsync(id, nameof(ScadaRequestHeader.Id), x => x.ScadaRequestDetails);
        }

        public async Task<List<ScadaRequestHeaderResponse>> GetScadaRequestHeadersAsync()
        {
            return (await _scadaRequestHeaderRepo.GetAllAsync(x => x.ScadaRequestDetails)).Select(x => new ScadaRequestHeaderResponse(x)).ToList();
        }

        public async Task<ScadaRequestHeader> UpdateScadaRequestHeaderAsync(ScadaRequestHeaderUpdateRequest scadaRequestHeader)
        {
            var header = await _scadaRequestHeaderRepo.GetAsync(scadaRequestHeader.Id, nameof(scadaRequestHeader.Id), x => x.ScadaRequestDetails);

            header.Map(scadaRequestHeader);

            return await _scadaRequestHeaderRepo.UpdateAsync(header);
        }

        public async Task<ScadaRequestHeader> AddScadaRequestHeaderAsync(ScadaRequestHeaderRequest scadaRequestHeader)
        {
            var header = new ScadaRequestHeader();
            header.Map(scadaRequestHeader);

            return await _scadaRequestHeaderRepo.AddAsync(header);
        }

        public async Task<ScadaRequestHeader> RemoveScadaRequestHeaderAsync(int id)
        {
            return await _scadaRequestHeaderRepo.RemoveAsync(id);
        }

        public async Task<ScadaRequestHeader> GetScadaRequestHeaderByJobTypeAndDescriptionAsync(int jobType, string description)
        {
            return await _scadaRequestHeaderRepo.GetAsync(x => x.JobType == jobType && x.Description.Equals(description));
        }
        public async Task<ScadaRequestHeader> GetOrCreateScadaRequestHeaderDefaultAsync(int jobType, DateTime now)
        {
            var header = await GetScadaRequestHeaderByJobTypeAndDescriptionAsync(jobType, $"Default for new meter {((jobType == 1) ? "Profiles" : "Readings")}");

            if (header is null)
            {
                header = await AddScadaRequestHeaderAsync(new ScadaRequestHeaderRequest
                {
                    Status = 1,
                    Active = true,
                    CreatedDTM = now,
                    StartRunDTM = now,
                    LastRunDTM = null,
                    CurrentRunDTM = null,
                    JobType = jobType,
                    Description = $"Default for new meter {((jobType == 1) ? "Profiles" : "Readings")}",
                    Interval = 0,
                });
            }

            return header;
        }
        public async Task HandleNewMappedMeterAsync(MappedMeter meter, int amrMeterId)
        {
            var now = DateTime.UtcNow;

            var profileDetail1 = await GetScadaRequestDetailAsyncByJobTypeAndAmrMeterIdAsync(1, amrMeterId);

            if (profileDetail1 is null)
            {
                var header = await GetOrCreateScadaRequestHeaderDefaultAsync(1, now);

                await AddScadaRequestDetailAsync(new ScadaRequestDetailRequest
                {
                    HeaderId = header.Id,
                    AmrMeterId = amrMeterId,
                    AmrScadaUserId = 1,
                    Status = 1,
                    Active = true,
                    LastRunDTM = null,
                    CurrentRunDTM = null,
                    UpdateFrequency = meter.SupplyTypeId.Equals(4) ? 120 : 720,
                    LastDataDate = DateOperations.FirstDayOfPreviousMonth(now)
                });
            }


            var profileDetail2 = await GetScadaRequestDetailAsyncByJobTypeAndAmrMeterIdAsync(2, amrMeterId);

            if (profileDetail2 is null)
            {
                var header = await GetOrCreateScadaRequestHeaderDefaultAsync(2, now);

                await AddScadaRequestDetailAsync(new ScadaRequestDetailRequest
                {
                    HeaderId = header.Id,
                    AmrMeterId = amrMeterId,
                    AmrScadaUserId = 1,
                    Status = 1,
                    Active = true,
                    LastRunDTM = null,
                    CurrentRunDTM = null,
                    UpdateFrequency = meter.SupplyTypeId.Equals(4) ? 120 : 720,
                    LastDataDate = DateOperations.FirstDayOfPreviousMonth(now)
                });
            }
        }
        #endregion

        #region Details
        public async Task<ScadaRequestDetail> GetScadaRequestDetailAsync(int id)
        {
            return await _scadaRequestDetailRepo.GetAsync(id);
        }

        public async Task<List<ScadaRequestDetail>> GetScadaRequestDetailsAsync()
        {
            return await _scadaRequestDetailRepo.GetAllAsync();
        }

        public async Task<ScadaRequestDetail> UpdateScadaRequestDetailAsync(ScadaRequestDetailUpdateRequest scadaRequestDetail)
        {
            var detail = await _scadaRequestDetailRepo.GetAsync(scadaRequestDetail.Id, nameof(scadaRequestDetail.Id), x => x.AmrMeter, x => x.AmrScadaUser, x => x.Header);

            detail.Map(scadaRequestDetail);

            return await _scadaRequestDetailRepo.UpdateAsync(detail);
        }

        public async Task<ScadaRequestDetail> AddScadaRequestDetailAsync(ScadaRequestDetailRequest scadaRequestDetail)
        {
            var detail = new ScadaRequestDetail();
            detail.Map(scadaRequestDetail);

            return await _scadaRequestDetailRepo.AddAsync(detail);
        }

        public async Task<ScadaRequestDetail> RemoveScadaRequestDetailAsync(int id)
        {
            return await _scadaRequestDetailRepo.RemoveAsync(id);
        }

        
        public async Task<ScadaRequestDetail> GetScadaRequestDetailAsyncByJobTypeAndAmrMeterIdAsync(int jobType, int amrMeterId)
        {
            return await _scadaRequestDetailRepo.GetAsync(x => x.Active && x.AmrMeterId.Equals(amrMeterId) && x.Header.JobType.Equals(jobType), x => x.Header);
        }

        
        #endregion
    }
}
