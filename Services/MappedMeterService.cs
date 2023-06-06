using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IMappedMeterService
    {
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuilding(int buildingId);
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMeters();
        public Task<MappedMeterResponse<MappedMeter>> GetMappedMeter(int id);
    }
    public class MappedMetersService : IMappedMeterService
    {
        private readonly ILogger<MappedMetersService> _logger;
        private readonly IMappedMeterRepository _repo;

        public MappedMetersService(IMappedMeterRepository repo, ILogger<MappedMetersService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuilding(int buildingId)
        {
            _logger.LogInformation($"Getting meters for Building: {buildingId}");

            var response = new MappedMeterResponse<List<MappedMeter>>(buildingId);

            try
            {
                response = await _repo.GetMappedMetersByBuilding(buildingId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.ResponseMessage = "Error";
            }

            return response;
        }

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMeters()
        {
            _logger.LogInformation($"Getting all MappedMeters");

            var response = new MappedMeterResponse<List<MappedMeter>>();

            try
            {
                response = await _repo.GetMappedMeters();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.ResponseMessage = "Error";
            }

            return response;
        }

        public async Task<MappedMeterResponse<MappedMeter>> GetMappedMeter(int id)
        {
            _logger.LogInformation($"Getting MappedMeter {id}");

            var response = new MappedMeterResponse<MappedMeter>();

            try
            {
                response = await _repo.GetMappedMeter(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.ResponseMessage = "Error";
            }

            return response;
        }
    }
}
