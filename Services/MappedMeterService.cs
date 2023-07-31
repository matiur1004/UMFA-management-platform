using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IMappedMeterService
    {
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuildingAsync(int buildingId);
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersAsync();
        public Task<MappedMeterResponse<MappedMeter>> GetMappedMeterAsync(int id);
        public Task UpdateMappedMeterAsync(MappedMeter mm);
        public Task DeleteMappedMeterAsync(MappedMeter mm);

        public Task AddUmfaMappedMeterAsync(MappedMeter meter);
    }
    public class MappedMetersService : IMappedMeterService
    {
        private readonly ILogger<MappedMetersService> _logger;
        private readonly IMappedMeterRepository _repo;
        private readonly IUmfaService _umfaService;

        public MappedMetersService(IMappedMeterRepository repo, ILogger<MappedMetersService> logger, IUmfaService umfaService)
        {
            _repo = repo;
            _logger = logger;
            _umfaService = umfaService;
        }

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuildingAsync(int buildingId)
        {
            _logger.LogInformation($"Getting meters for Building: {buildingId}");

            var response = new MappedMeterResponse<List<MappedMeter>>(buildingId);

            try
            {
                response = await _repo.GetMappedMetersByBuildingAsync(buildingId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.ResponseMessage = "Error";
            }

            return response;
        }

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersAsync()
        {
            _logger.LogInformation($"Getting all MappedMeters");

            var response = new MappedMeterResponse<List<MappedMeter>>();

            try
            {
                response = await _repo.GetMappedMetersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.ResponseMessage = "Error";
            }

            return response;
        }

        public async Task<MappedMeterResponse<MappedMeter>> GetMappedMeterAsync(int id)
        {
            _logger.LogInformation($"Getting MappedMeter {id}");

            var response = new MappedMeterResponse<MappedMeter>();

            try
            {
                response = await _repo.GetMappedMeterAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.ResponseMessage = "Error";
            }

            return response;
        }

        public async Task UpdateMappedMeterAsync(MappedMeter mm)
        {
            _logger.LogInformation($"Updating meter {mm.MappedMeterId}");
            
            await _repo.UpdateMappedMeterAsync(mm);
        }

        public async Task DeleteMappedMeterAsync(MappedMeter mm)
        {
            await _repo.DeleteMappedMeterAsync(mm);
        }

        public async Task AddUmfaMappedMeterAsync(MappedMeter meter)
        {
            await _umfaService.AddMappedMeterAsync(new MappedMeterSpRequest(meter));
        }
    }
}
