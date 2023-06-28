using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IUmfaService
    {
        public Task<UMFAShopsSpResponse> GetShopsAsync(UmfaShopsRequest request);
        public Task<TenantSlipCardInfo> GetTenantSlipCardInfo(TenantSlipCardInfoSpRequest request);
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
            return await _repository.GetShopsASync(request);
        }

        public async Task<TenantSlipCardInfo> GetTenantSlipCardInfo(TenantSlipCardInfoSpRequest request)
        {
            return (await _repository.GetTenantSlipCardInfo(request)).TenantSlipCardInfos.First();
        }
    }
}
