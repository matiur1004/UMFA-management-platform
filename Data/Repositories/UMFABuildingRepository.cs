using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Data.Repositories
{
    public interface IUMFABuildingRepository
    {
        Task<UMFABuildingResponse> GetBuildings(int umfaUserId);
        Task<UMFABuildingResponse> GetBuilding(int umfaUserId, int buildingId);
        Task<UMFAPartnerResponse> GetPartnersAsync(int umfaUserId);
        Task<UMFAPeriodResponse> GetPeriodsAsync(int umfaBuildingId);
        Task<Building> AddLocalBuilding(int umfaId, string name, int partnerId, string partner, User user);
        Task<UMFABuildingServiceResponse> GetUMFABuildingServices(int umfaBuildingId);
        Task<UMFAMeterResponse> GetMetersForBuilding(int umfaBuildingId);
    }
    public class UMFABuildingRepository : IUMFABuildingRepository
    {
        private readonly ILogger<UMFABuildingRepository> _logger;
        private readonly UmfaDBContext _context;
        private readonly PortalDBContext _dbContext;

        public UMFABuildingRepository(ILogger<UMFABuildingRepository> logger,
            UmfaDBContext context, PortalDBContext dbContext)
        {
            _logger = logger;
            _context = context;
            _dbContext = dbContext;
        }

        public async Task<UMFABuildingServiceResponse> GetUMFABuildingServices(int umfaBuildingId) {
            var ret = new UMFABuildingServiceResponse();
            try
            {
                var result = await _context.UMFABuildingServices.Where(bs => bs.BuildingId == umfaBuildingId).ToListAsync();
                if (result != null && result.Count > 0)
                {
                    ret.Response = "Success";
                    ret.ErrorMessage = "";
                    ret.BuildingServices = result;
                } else
                {
                    ret.Response = "Failed";
                    ret.ErrorMessage = $"No results returned for building {umfaBuildingId}";
                    return ret;
                }
                return ret;
            }
            catch (Exception ex)
            {
                ret.Response = "Error";
                ret.ErrorMessage = ex.Message;
                _logger.LogError("Error while getting building services for building {buildingid}", umfaBuildingId);
                return ret;
            }
        }

        public async Task<UMFAPeriodResponse> GetPeriodsAsync(int umfaBuildingId)
        {
            var ret = new UMFAPeriodResponse(umfaBuildingId);
            try
            {
                var result = await _context.UMFAPeriods.FromSqlRaw($"exec upPortal_GetPeriodsForBuilding {umfaBuildingId}").ToListAsync();
                ret.Periods = result;
                return ret;
            }
            catch (Exception ex)
            {
                ret.Status = "Error";
                ret.ErrorMessage = ex.Message;
                _logger.LogError("Error while retrieving periods for building {buildingId}: {msg}", umfaBuildingId, ex.Message);
                return ret;
            }
        }

        public async Task<UMFAPartnerResponse> GetPartnersAsync(int umfaUserId)
        {
            var ret = new UMFAPartnerResponse(umfaUserId);
            try
            {
                var result = await _context.UmfaPartners.FromSqlRaw($"exec upPortal_GetPartnersForUser {umfaUserId}").ToListAsync();
                ret.Partners = result;
                return ret;
            }
            catch (Exception ex)
            {
                ret.Status = "Error";
                ret.ErrorMessage = ex.Message;
                _logger.LogError("Error while retrieving partners for user {UserId}: {msg}", umfaUserId, ex.Message);
                return ret;
            }
        }

        public async Task<Building> AddLocalBuilding(int umfaId, string name, int partnerId, string partner, User user)
        {
            try
            {
                Building building = _dbContext.Buildings.Where(b => b.UmfaId == umfaId)
                    .Include(b => b.Users)
                    .FirstOrDefault();
                User thisUser = user;

                if (building == null)
                {
                    building = new Building() { UmfaId = umfaId, Name = name, PartnerId = partnerId, Partner = partner, Users = new List<User>() };
                    building.Users.Add(thisUser);
                    await _dbContext.AddAsync(building);
                }
                else
                {
                    building.Users.Add(thisUser);
                }

                if (SaveLocalAsync().Result)
                {
                    _logger.LogInformation("Successfully saved building {Building}", name);
                }

                return building;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while adding building: {Message}", ex.Message);
                throw new ApplicationException($"Error while adding building: {ex.Message}");
            }
        }

        public async Task<UMFABuildingResponse> GetBuilding(int umfaUserId, int buildingId)
        {
            var ret = new UMFABuildingResponse(umfaUserId);
            try
            {
                var result = await _context.UmfaBuildings.FromSqlRaw($"exec upPortal_BuildingsForUser {umfaUserId}, {buildingId}").ToListAsync();
                ret.UmfaBuildings = result;
                ret.Response = $"Successfully retrieved {result.Count} buildings for user {umfaUserId}";
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving umfa buildings for user {umfaUserId}: {Message}", umfaUserId, ex.Message);
                ret.Response = $"Error while retrieving umfa buildings for user {umfaUserId}: {ex.Message}";
                return ret;
            }
        }

        public async Task<UMFABuildingResponse> GetBuildings(int umfaUserId)
        {
            //_logger.LogInformation($"Using connectionstring: {_context.Database.GetConnectionString()}");
            var ret = new UMFABuildingResponse(umfaUserId);
            try
            {
                var result = await _context.UmfaBuildings.FromSqlRaw($"exec upPortal_BuildingsForUser {umfaUserId}").ToListAsync();
                ret.UmfaBuildings = result;
                ret.UmfaBuildings.Sort((b1, b2) => string.Compare(b1.Name, b2.Name));
                ret.Response = $"Successfully retrieved {result.Count} buildings for user {umfaUserId}";
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving umfa buildings for user {umfaUserId}: {ex.Message}");
                ret.Response = $"Error while retrieving umfa buildings for user {umfaUserId}: {ex.Message}";
                return ret;
            }
        }

        public async Task<UMFAMeterResponse> GetMetersForBuilding(int umfaBuildingId)
        {
            var ret = new UMFAMeterResponse(umfaBuildingId);
            try
            {
                var result = await _context.UMFAMeters.FromSqlRaw($"exec upPortal_GetMetersForBuilding {umfaBuildingId}").ToListAsync();
                ret.UmfaMeters = result;
                ret.UmfaMeters.Sort((b1, b2) => string.Compare(b1.MeterNo, b2.MeterNo));
                ret.Response = $"Successfully retrieved {result.Count} Meters for Building {umfaBuildingId}";
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving umfa buildings for user {umfaBuildingId}: {ex.Message}");
                ret.Response = $"Error while retrieving umfa buildings for user {umfaBuildingId}: {ex.Message}";
                return ret;
            }
        }

        public async Task<bool> SaveLocalAsync()
        {
            try
            {
                var ret = await _dbContext.SaveChangesAsync();
                return ret > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while saving building: {Message}", ex.Message);
                throw new ApplicationException($"Error while saving meter: {ex.Message}");
            }
        }

    }
}
