using ClientPortal.Data;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public class MappedMetersService
    {
        private readonly ILogger<MappedMetersService> _logger;
        private readonly IMappedMeterRepository _repo;

        public MappedMetersService(IMappedMeterRepository repo, ILogger<MappedMetersService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<MappedMeterResponse> GetAllMappedMetersForBuilding(int buildingId)
        {
            _logger.LogInformation($"Getting meters for Building: {buildingId}");

            var response = new MappedMeterResponse(buildingId);

            try
            {
                response = await _repo.GetMappedMeters(buildingId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.Response = "Error";
            }

            return response;
        }

        public async Task<MappedMeterResponse> GetAllMappedMeters()
        {
            _logger.LogInformation($"Getting all MappedMeters");

            var response = new MappedMeterResponse();

            try
            {
                response = await _repo.GetMappedMeters();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, response.ErrorMessage);
                response.ErrorMessage = ex.Message;
                response.Response = "Error";
            }

            return response;
        }
    }
}
