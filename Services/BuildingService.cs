using ClientPortal.Data.Repositories;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IBuildingService
    {
        Task<UMFABuildingResponse> GetUmfaBuildingsAsync(int umfaUserId);
        Task<UMFAPartnerResponse> GetPartnersForUserAsync(int umfaUserId);
        Task<UMFAPeriodResponse> GetPeriodsForBuildingAsync(int umfaBuildingId);
        Task<UMFAMeterResponse> GetUmfaMetersAsync(int umfaBuildingId);

    }
    public class BuildingService : IBuildingService
    {
        private readonly ILogger<BuildingService> _logger;
        private readonly IUMFABuildingRepository _buildingRepo;

        public BuildingService(ILogger<BuildingService> logger,
            IUMFABuildingRepository buildingRepo)
        {
            _logger = logger;
            _buildingRepo = buildingRepo;
        }

        public async Task<UMFAPeriodResponse> GetPeriodsForBuildingAsync(int umfaBuildingId)
        {
            _logger.LogInformation("Get All Periods for building {buildingId}", umfaBuildingId);
            try
            {
                var ret = await _buildingRepo.GetPeriodsAsync(umfaBuildingId);
                if (ret == null || ret.Status == "Error")
                {
                    _logger.LogError("Error while getting periods for building {buildingId}: {msg}", umfaBuildingId, ret?.ErrorMessage);
                    throw new ApplicationException($"Error while getting periods for building {umfaBuildingId}: {ret?.ErrorMessage}");
                }
                else if (ret.Periods.Count == 0)
                {
                    _logger.LogError("Getting periods for building {buildingId} did not return any results", umfaBuildingId);
                    throw new ApplicationException($"Getting periods for building {umfaBuildingId} did not return any results");
                }
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting periods for building {buildingId}: {msg}", umfaBuildingId, ex.Message);
                throw new ApplicationException($"Error while getting periods for building {umfaBuildingId}: {ex.Message}");
            }
        }

        public async Task<UMFAPartnerResponse> GetPartnersForUserAsync(int umfaUserId)
        {
            _logger.LogInformation("Get All Partners for user {umfaUserId}", umfaUserId);
            try
            {
                var ret = await _buildingRepo.GetPartnersAsync(umfaUserId);
                if(ret == null || ret.Status == "Error")
                {
                    _logger.LogError("Error while getting partners for user {umfaUserId}: {msg}", umfaUserId, ret?.ErrorMessage);
                    throw new ApplicationException($"Error while getting partners for user {umfaUserId}: {ret?.ErrorMessage}");
                }
                else if(ret.Partners.Count == 0)
                {
                    _logger.LogError("Getting partners for user {umfaUserId} did not return any results", umfaUserId);
                    throw new ApplicationException($"Getting partners for user {umfaUserId} did not return any results");
                }
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while getting partners for user {umfaUserId}: {msg}", umfaUserId, ex.Message);
                throw new ApplicationException($"Error while getting partners for user {umfaUserId}: {ex.Message}");
            }
        }

        public async Task<UMFABuildingResponse> GetUmfaBuildingsAsync(int umfaUserId)
        {
            _logger.LogInformation($"Get all umfa buildings for user {umfaUserId}");
            try
            {
                var ret = await _buildingRepo.GetBuildings(umfaUserId);
                if (ret == null || ret.UserId == 0 || ret.UmfaBuildings.Count == 0)
                {
                    _logger.LogError($"Failure to get buildings for user {umfaUserId}: {ret?.Response ?? "No Reponse message"}");
                    throw new ApplicationException(ret?.Response ?? "No Reponse message");
                }
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting buildings for user {umfaUserId}: {ex.Message}");
                throw new ApplicationException(ex.Message);
            }
        }
        public async Task<UMFAMeterResponse> GetUmfaMetersAsync(int umfaBuildingId)
        {
            _logger.LogInformation($"Get all umfa buildings for user {umfaBuildingId}");
            try
            {
                var ret = await _buildingRepo.GetMetersForBuilding(umfaBuildingId);
                if (ret == null || ret.UmfaMeters.Count == 0)
                {
                    _logger.LogError($"Failure to get buildings for user {umfaBuildingId}: {ret?.Response ?? "No Response message"}");
                    throw new ApplicationException(ret?.Response ?? "No Response message");
                }
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting buildings for user {umfaBuildingId}: {ex.Message}");
                throw new ApplicationException(ex.Message);
            }
        }

    }
}
