using ClientPortal.Data.Repositories;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IHomeService {
        PortalStatsResponse? GetHomeStats();
    }
    public class HomeService : IHomeService
    {
        private readonly IPortalStatsRepository _portalStats;
        private readonly ILogger<HomeService> _logger;

        public HomeService(IPortalStatsRepository portalStats, ILogger<HomeService> logger)
        {
            _portalStats = portalStats;
            _logger = logger;
        }
        public PortalStatsResponse? GetHomeStats()
        {
            _logger.LogInformation("Getting the stats...");
            try
            {
                var response = _portalStats.GetStatsAsync().Result;
                if (response != null && response.Partners != -1) return response;
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
