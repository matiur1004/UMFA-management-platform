using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface ISmartServicesService
    {
        public Task<SmartServicesMainWaterSpResponse> GetSmartServicesMainWaterAsync(SmartServicesMainWaterSpRequest request);

        public Task<SmartServicesMainElectricitySpResponse> GetSmartServicesMainElectricityAsync(SmartServicesMainElectricitySpRequest request);
    }
    public class SmartServicesService: ISmartServicesService
    {
        private readonly ILogger<SmartServicesService> _logger;
        private readonly IPortalSpRepository _repository;
        public SmartServicesService(ILogger<SmartServicesService> logger, IPortalSpRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        public async Task<SmartServicesMainWaterSpResponse> GetSmartServicesMainWaterAsync(SmartServicesMainWaterSpRequest request)
        {
            return await _repository.GetSmartServicesMainWaterAsync(request);
        }

        public async Task<SmartServicesMainElectricitySpResponse> GetSmartServicesMainElectricityAsync(SmartServicesMainElectricitySpRequest request)
        {
            return await _repository.GetSmartServicesMainElectricityAsync(request);
        }
    }
}
