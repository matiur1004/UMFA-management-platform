using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IUmfaReportService 
    {
        public Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request);
    }
    public class UmfaReportService : IUmfaReportService
    {
        private readonly ILogger<UmfaReportService> _logger;
        private readonly IUmfaRepository _repository;
        public UmfaReportService(ILogger<UmfaReportService> logger, IUmfaRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }
        public async Task<UtilityRecoveryReportResponse> GetUtilityRecoveryReportAsync(UtilityRecoveryReportRequest request)
        {
            return await _repository.GetUtilityRecoveryReportAsync(request);
        }
    }
}
