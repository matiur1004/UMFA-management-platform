using AutoMapper;
using ClientPortal.Data.Entities;
using ClientPortal.Models;

namespace ClientPortal.Data.Repositories
{
    public interface IPortalStatsRepository
    {
        Task<PortalStatsResponse> GetStatsAsync();
    }
    public class PortalStatsRepository : IPortalStatsRepository
    {
        private readonly ILogger<PortalStatsRepository> _logger;
        private readonly UmfaDBContext _context;
        private readonly IMapper _mapper;

        public PortalStatsRepository(ILogger<PortalStatsRepository> logger, 
            UmfaDBContext context, 
            IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<PortalStatsResponse> GetStatsAsync()
        {
            //_logger.LogInformation($"Retrieving stats from database...");
            var stats = new PortalStatsResponse() { Partners = -1, Buildings = 0, Clients = 0, Shops = 0, Tenants = 0, Response = "State: Initiated" };
            try
            {
                var result = await _context.GetStats.FromSqlRaw<PortalStats>("exec upPortal_stats").ToListAsync();
                stats = _mapper.Map<PortalStatsResponse>(result.FirstOrDefault());
                return stats;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Error while retrieving stats from database: {ex.Message}");
                stats.Response = $"Error while retrieving stats from database: {ex.Message}";
                return stats;
            }
        } 
    }
}
