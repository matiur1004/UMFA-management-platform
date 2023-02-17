using ClientPortal.Data.Repositories;
using ClientPortal.Models;

namespace ClientPortal.Services
{
    public class DashboardService
    {
        private readonly IPortalStatsRepository _portalStats;
        private readonly ILogger<DashboardService> _logger;

        public DashboardService(IPortalStatsRepository portalStats, ILogger<DashboardService> logger)
        {
            _portalStats = portalStats;
            _logger = logger;
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
    }
}
