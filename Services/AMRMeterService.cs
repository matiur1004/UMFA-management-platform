using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IAMRMeterService
    {
        Task<AMRMeterResponse> AddMeterAsync(AMRMeterUpdateRequest meter);
        Task<AMRMeterResponse> GetMeterAsync(int id);
        Task<AMRMeterResponseList> GetAllMetersForUser(int userId);
        Task<AMRMeterResponseList> GetAllMetersForUserChart(int userId, int chartId, bool isTenant = false);
        Task<AMRMeterResponse> EditMeterAsync(AMRMeterUpdateRequest meter);
        Task<List<UtilityResponse>> GetMakeModels();
    }

    public class AMRMeterService : IAMRMeterService
    {
        private readonly ILogger<AMRMeterService> _logger;
        private readonly IAMRMeterRepository _meterRepo;

        public AMRMeterService(ILogger<AMRMeterService> logger, IAMRMeterRepository meterRepo)
        {
            _logger = logger;
            _meterRepo = meterRepo;
        }

        public async Task<AMRMeterResponse> EditMeterAsync(AMRMeterUpdateRequest updMeter)
        {
            if (updMeter.Meter == null) throw new ApplicationException($"Empty meter object received to update");
            _logger.LogInformation("Attempt to edit meter: {MeterNo}", updMeter.Meter.MeterNo);
            try
            {
                var result = await _meterRepo.Edit(updMeter.Meter, updMeter.UserId);
                if (result.Id > 0)
                {
                    _logger.LogInformation("Meter updated with id: {Id}", result.Id);
                    return result;
                }
                else throw new Exception("Meter not updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while updating meter {MeterNo}: {Message}", updMeter.Meter.MeterNo, ex.Message);
                throw new ApplicationException($"Error while updating meter {updMeter.Meter.MeterNo}: {ex.Message}");
            }
        }

        public async Task<AMRMeterResponse> AddMeterAsync(AMRMeterUpdateRequest meter)
        {
            _logger.LogInformation("Attempt to add new meter: {MeterNo}", meter.Meter.MeterNo);
            try
            {
                var result = await _meterRepo.AddMeterAsync(meter);
                if (result.Id > 0)
                {
                    _logger.LogInformation("New meter added with id: {Id}", result.Id);
                    return result;
                }
                else throw new Exception("New meter not added successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while add new meter {MeterNo}: {Message}", meter.Meter.MeterNo, ex.Message);
                throw new ApplicationException(ex.Message);
            }
        }

        public async Task<AMRMeterResponseList> GetAllMetersForUser(int userId)
        {
            _logger.LogInformation("Getting meters for user: {userId}", userId);
            try
            {
                var result = await _meterRepo.GetMetersForUserAsync(userId);
                if (result.Message.StartsWith("Error")) throw new Exception($"Meters for user {userId} not found");
                else return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting meters for user: {userId}: {Message}", userId, ex.Message);
                throw new ApplicationException($"Error while getting meters for user: {userId}: {ex.Message}");
            }
        }

        public async Task<AMRMeterResponseList> GetAllMetersForUserChart(int userId, int chartId, bool isTenant = false)
        {
            _logger.LogInformation("Getting meters for user: {userId}", userId);
            try
            {
                var result = await _meterRepo.GetMetersForUserChartAsync(userId, chartId, isTenant);
                if (result.Message.StartsWith("Error")) throw new Exception($"Meters for user {userId} and chart {chartId} not found");
                else return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting meters for user: {userId} and chart: {chartId}: {Message}", userId, chartId, ex.Message);
                throw new ApplicationException($"Error while getting meters for user: {userId} and chart {chartId}: {ex.Message}");
            }
        }

        public async Task<AMRMeterResponse> GetMeterAsync(int id)
        {
            _logger.LogInformation("Getting meter with id: {id}", id);
            try
            {
                var result = await _meterRepo.GetMeterAsync(id);
                if (result != null) return result;
                else throw new Exception($"Meter for id {id} not found");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting meter with id: {id}", id);
                throw new ApplicationException(ex.Message);
            }
        }

        public async Task<List<UtilityResponse>> GetMakeModels()
        {
            _logger.LogInformation("Getting all Make and Models");
            try
            {
                var result = await _meterRepo.GetMakeModels();
                if (result != null) return result;
                else throw new ApplicationException("No results return for Make and Models");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving makes and models: {Message}", ex.Message);
                throw new ApplicationException($"Error while retrieving makes and models: {ex.Message}");
            }
        }
    }
}
