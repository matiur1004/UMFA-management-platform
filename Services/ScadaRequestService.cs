using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;

namespace ClientPortal.Services
{
    public interface IScadaRequestService
    {
        public Task<List<ScadaRequestHeader>> GetScadaRequestHeadersAsync();
        public Task<ScadaRequestHeader> GetScadaRequestHeaderAsync(int id);
        public Task<ScadaRequestHeader> UpdateScadaRequestHeaderAsync(ScadaRequestHeaderUpdateRequest scadaRequestHeader);
        public Task<ScadaRequestHeader> AddScadaRequestHeaderAsync(ScadaRequestHeaderRequest scadaRequestHeader);
        public Task<ScadaRequestHeader> RemoveScadaRequestHeaderAsync(int id);

        public Task<List<ScadaRequestDetail>> GetScadaRequestDetailsAsync();
        public Task<ScadaRequestDetail> GetScadaRequestDetailAsync(int id);
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

        public async Task<List<ScadaRequestHeader>> GetScadaRequestHeadersAsync()
        {
            return await _scadaRequestHeaderRepo.GetAllAsync(x => x.ScadaRequestDetails);
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
        #endregion
    }
}
