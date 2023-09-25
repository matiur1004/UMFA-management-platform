using ClientPortal.Data.Entities.UMFAEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public class DashboardService
    {
        private readonly IPortalStatsRepository _portalStats;
        private readonly ILogger<DashboardService> _logger;
        readonly IBuildingService _buildingService;
        private readonly IUserService _userService;
        private readonly IMappedMeterService _mappedMeterService;
        private readonly IUmfaService _umfaService;
        private readonly IPortalSpRepository _portalSpRepository;

        public DashboardService(IPortalStatsRepository portalStats, ILogger<DashboardService> logger, IBuildingService buildingService,
            IUserService userService, IMappedMeterService mappedMeterService, IUmfaService umfaService, IPortalSpRepository portalSpRepository)
        {
            _buildingService = buildingService;
            _userService = userService;
            _portalStats = portalStats;
            _logger = logger;
            _mappedMeterService = mappedMeterService;
            _umfaService = umfaService;
            _portalSpRepository = portalSpRepository;
        }

        public DashboardMainResponse GetMainDashboard(int umfaUserId)
        {
            _logger.LogInformation("Getting the stats for main dashboard page...");
            try
            {
                var response = _portalStats.GetDashboardMainAsync(umfaUserId).Result;
                if (response != null && response.Response == "Success") return response;
                else throw new Exception($"Stats not return correctly: {response?.Response}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting the stats: {ex.Message}");
                return null;
            }
        }

        public async Task<TenantMainDashboardResponse> GetTenantMainDashboard(int umfaUserId)
        {
            _logger.LogInformation("Getting the stats for tenant main dashboard page...");
            try
            {
                var tenantDashBoardResposne = await _umfaService.GetTenantMainDashboardAsync(umfaUserId);
                var ids = string.Join(",", tenantDashBoardResposne.BuildingServiceIds);

                var smartServicesSpResponse = await _portalSpRepository.GetSmartServicesForTenant(new SmartServicesTenantSpRequest { BuildingServiceIds = ids });

                return new TenantMainDashboardResponse(tenantDashBoardResposne, smartServicesSpResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting the stats: {ex.Message}");
                return null;
            }
        }

        public DashboardMainResponse GetBuildingDashboard(int buildingId)
        {
            _logger.LogInformation("Getting the stats for building dashboard page...");
            try
            {
                var response = _portalStats.GetDashboardBuildingAsync(buildingId).Result;
                if (response != null && response.Response == "Success") return response;
                else throw new Exception($"Stats not return correctly: {response?.Response}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting the stats: {ex.Message}");
                return null;
            }
        }

        public List<DashboardBuilding> GetBuildingList(int umfaUserId)
        {
            _logger.LogInformation("Getting the buildings for buildings dashboard page...");

            var mappedMetersResponse = _mappedMeterService.GetMappedMetersAsync().Result;

            if (mappedMetersResponse is null || mappedMetersResponse.ErrorMessage is not null)
            {
                _logger.LogError($"Mapped Metersnot returned correctly: {mappedMetersResponse?.ErrorMessage}");
                return new List<DashboardBuilding>();
            }

            var buildings = mappedMetersResponse.Body.Select(mm => mm.BuildingId).Distinct().ToList();

            List<DashboardBuilding> ret = new();

            var user = _userService.GetUserById(umfaUserId);
            var response = _buildingService.GetUmfaBuildingsAsync(user.UmfaId).Result;
            
            if (response != null && response.Response.Contains("Success"))
            {
                foreach (UMFABuilding bld in response.UmfaBuildings)
                {
                    ret.Add(new()
                    {
                        UmfaBuildingId = bld.BuildingId,
                        BuildingName = bld.Name,
                        PartnerId = bld.PartnerId,
                        PartnerName = bld.Partner,
                        IsSmart = (buildings.Contains(bld.BuildingId))
                    });
                }
                return ret;
            }
            else
            {
                _logger.LogError($"Stats not return correctly: {response?.Response}");
                return new List<DashboardBuilding>();
            }
        }

        public async Task<List<ShopDashboardShop>> GetShopDataAsync(int buildingId)
        {
            return await _umfaService.GetDashboardShopDataAsync(buildingId);
        }
    }
}
