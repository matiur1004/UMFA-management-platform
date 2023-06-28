using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IUmfaService
    {
        public Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request);
        public Task<List<UMFAShop>> GetTenantShopsAsync(UmfaTenantShopsSpRequest request);
        public Task<List<UMFATenant>> GetTenantsAsync(UmfaTenantsSpRequest request);
        public Task<TenantSlipCardInfo> GetTenantSlipCardInfoAsync(TenantSlipCardInfoSpRequest request);
        public Task<TenantSlipCriteriaResponse> GetTenantSlipCriteriaAsync(TenantSlipCriteriaSpRequest request);
        public Task<TenantSlipReportSpResponse> GetTenantSlipReportsAsync(TenantSlipReportSpRequest request);
        public Task<TenantSlipDataResponse> GetTenantSlipDataAsync(TenantSlipDataRequest request);

    }
    public class UmfaService : IUmfaService
    {
        private readonly ILogger<UmfaService> _logger;
        private readonly IUmfaRepository _repository;

        public UmfaService(ILogger<UmfaService> logger, IUmfaRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        public async Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request)
        {
            return await _repository.GetShopsAsync(request);
        }

        public async Task<TenantSlipCriteriaResponse> GetTenantSlipCriteriaAsync(TenantSlipCriteriaSpRequest request)
        {
            var response = await _repository.GetTenantSlipCriteriaAsync(request);
            return new TenantSlipCriteriaResponse(response);
        }

        public async Task<TenantSlipCardInfo> GetTenantSlipCardInfoAsync(TenantSlipCardInfoSpRequest request)
        {
            return (await _repository.GetTenantSlipCardInfoAsync(request)).TenantSlipCardInfos.First();
        }

        public async Task<List<UMFATenant>> GetTenantsAsync(UmfaTenantsSpRequest request)
        {
            return (await _repository.GetTenantsAsync(request)).Tenants;
        }

        public async Task<List<UMFAShop>> GetTenantShopsAsync(UmfaTenantShopsSpRequest request)
        {
            var response = await _repository.GetTenantShopsAsync(request);
            return response.Shops;
        }

        public async Task<TenantSlipReportSpResponse> GetTenantSlipReportsAsync(TenantSlipReportSpRequest request)
        {
            return await _repository.GetTenantSlipReportsAsync(request);
        }

        public async Task<TenantSlipDataResponse> GetTenantSlipDataAsync(TenantSlipDataRequest request)
        {
            var response = await _repository.GetTenantSlipDataAsync(new TenantSlipDataSpRequest(request));
            return new TenantSlipDataResponse(response);
        }
    }
}
