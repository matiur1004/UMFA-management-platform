using AutoMapper;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Entities.UMFAEntities;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using static DevExpress.Xpo.Helpers.AssociatedCollectionCriteriaHelper;

namespace ClientPortal.Data.Repositories
{
    public interface IAMRMeterRepository
    {
        Task<AMRMeterResponse> GetMeterAsync(int id);
        Task<AMRMeterResponseList> GetMetersForUserAsync(int userId);
        Task<AMRMeterResponseList> GetMetersForUserChartAsync(int userId, int chartId, bool isTenant = false);
        Task<AMRMeterResponseList> GetMetersForUserAndBuildingAsync(int userId, int buildingId);
        Task<AMRMeterResponse> AddMeterAsync(AMRMeterUpdateRequest meter);
        Task<AMRMeterResponse> Edit(AMRMeterRequest meter, int userId);
        Task<List<UtilityResponse>> GetMakeModels();
        bool RemoveMeterAsync(int meterId);
        Task<bool> SaveChangesAsync();
    }
    public class AMRMeterRepository : IAMRMeterRepository
    {
        private readonly PortalDBContext _dbContext;
        private readonly ILogger<AMRMeterRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IUMFABuildingRepository _buildingRepo;
        private readonly IUmfaService _umfaService;

        public AMRMeterRepository(PortalDBContext dbContext, ILogger<AMRMeterRepository> logger, IMapper mapper, IUMFABuildingRepository buildingRepo, IUmfaService umfaService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _mapper = mapper;
            _buildingRepo = buildingRepo;
            _umfaService = umfaService;
        }
        public async Task<AMRMeterResponse> AddMeterAsync(AMRMeterUpdateRequest meter)
        {
            //_logger.LogInformation($"New meter with serial: {meter.meterNo} to add.");
            try
            {
                var user = await _dbContext.Users.FindAsync(meter.UserId);
                var building = await _dbContext.Buildings.FirstOrDefaultAsync(b => b.UmfaId == meter.Meter.UmfaId && b.Users.Contains(user));
                if (building == null)
                {
                    UMFABuildingResponse resp = await _buildingRepo.GetBuilding(meter.UserId, meter.Meter.UmfaId);
                    UMFABuilding? ub = resp.UmfaBuildings.FirstOrDefault();
                    if (ub == null) throw new ApplicationException($"Building with id {meter.Meter.UmfaId} not found");
                    else building = await _buildingRepo.AddLocalBuilding(ub.BuildingId, ub.Name, ub.PartnerId, ub.Partner, user);
                }
                var newMeter = new AMRMeter(meter.Meter, user, building);
                await _dbContext.AddAsync(newMeter);
                var retMeter = new AMRMeter();
                if (SaveChangesAsync().Result)
                {
                    _logger.LogInformation("Successfully saved meter {MeterNo}", meter.Meter.MeterNo);
                    retMeter = await _dbContext.AMRMeters.Include(m => m.MakeModel).FirstOrDefaultAsync(m => m.Id == newMeter.Id);
                }
                return new AMRMeterResponse(retMeter);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error adding new meter with serial: {MeterNo}", meter.Meter.MeterNo);
                throw new ApplicationException($"Error adding new meter {meter.Meter.MeterNo}: {ex.Message}");
            }
        }

        public async Task<AMRMeterResponse> Edit(AMRMeterRequest meter, int userId)
        {
            try
            {
                AMRMeterResponse retMeter = new();
                if (meter == null) throw new ApplicationException("Empty meter object recieved");
                var usr = await _dbContext.Users.FindAsync(userId);
                if (usr == null || userId == 0) throw new ApplicationException($"Invalid userId supplied");
                meter.UserId = usr.Id;
                if (meter.Id == 0) //new meter
                {
                    AMRMeterUpdateRequest meterUpd = new() { Meter = meter, UserId = userId };
                    retMeter = await this.AddMeterAsync(meterUpd);
                }
                else //existing meter
                {
                    var result = await _dbContext.AMRMeters.FirstOrDefaultAsync(m => m.Id == meter.Id);
                    if (result == null) throw new ApplicationException($"Amr meter with id {meter.Id} not found");
                    if (result.MeterNo != meter.MeterNo) result.MeterNo = meter.MeterNo;
                    if (result.Description != meter.Description) result.Description = meter.Description;
                    if (result.BuildingId != meter.BuildingId && meter.BuildingId != 0) result.BuildingId = meter.BuildingId;
                    if (result.MakeModelId != meter.MakeModelId) result.MakeModelId = meter.MakeModelId;
                    if (result.Phase != meter.Phase) result.Phase = meter.Phase;
                    if (result.CbSize != meter.CbSize) result.CbSize = meter.CbSize;
                    if (result.CtSizePrim != meter.CtSizePrim) result.CtSizePrim = meter.CtSizePrim;
                    if (result.CtSizeSec != meter.CtSizeSec) result.CtSizeSec = meter.CtSizeSec;
                    if (result.ProgFact != meter.ProgFact) result.ProgFact = meter.ProgFact;
                    if (result.Digits != meter.Digits) result.Digits = meter.Digits;
                    if (result.Active != meter.Active) result.Active = meter.Active;
                    if (result.CommsId != meter.CommsId) result.CommsId = meter.CommsId;
                    if (result.MeterSerial != meter.MeterSerial) result.MeterSerial = meter.MeterSerial;
                    if (result.UserId != meter.UserId) result.UserId = meter.UserId;
                    retMeter = _mapper.Map<AMRMeterResponse>(result);

                    var ret = await SaveChangesAsync();
                    if (!ret) throw new ApplicationException("Error saving meter");
                }
                return retMeter;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error updating/adding amr scada meter {Meter} with id {id}: {Message}", meter?.MeterNo ?? "No meter recieved", meter?.Id ?? 0, ex.Message);
                throw new ApplicationException($"Error updating/adding amr scada user {meter?.MeterNo ?? "No user recieved"} with id {meter?.Id ?? 0}: {ex.Message}");
            }
        }

        public async Task<List<UtilityResponse>> GetMakeModels()
        {
            try
            {
                var utilities = await _dbContext.Utilities.Include(u => u.MeterMakeModels.Where(m => m.Active)).Where(u => u.Active).ToListAsync();
                if (utilities != null && utilities.Count > 0)
                {
                    var ret = _mapper.Map<List<UtilityResponse>>(utilities);
                    return ret;
                }
                else throw new ApplicationException($"No Make Model records found");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving MakeModels: {Message}", ex.Message);
                throw new ApplicationException($"Error retrieving MakeModels: {ex.Message}");
            }
        }

        public async Task<AMRMeterResponse> GetMeterAsync(int id)
        {
            //_logger.LogInformation($"Retrieving meter with id {id}");
            try
            {
                var meter = await _dbContext.AMRMeters
                    .Include(m => m.MakeModel)
                    .ThenInclude(mm => mm.Utility)
                    .FirstOrDefaultAsync(m => m.Id == id);
                if (meter != null)
                {
                    var ret = _mapper.Map<AMRMeterResponse>(meter);
                    return ret;
                }
                else throw new ApplicationException($"meter with id {id} not found");
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving meter {id}", id);
                throw new ApplicationException($"Error while retrieving meter {id}: {ex.Message}");
            }
        }

        public Task<AMRMeterResponseList> GetMetersForUserAndBuildingAsync(int userId, int buildingId)
        {
            throw new NotImplementedException();
        }

        public async Task<AMRMeterResponseList> GetMetersForUserAsync(int userId)
        {
            try
            {
                User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                
                var resp = await _buildingRepo.GetBuildings(user.UmfaId);

                List<int> ids = resp.UmfaBuildings.Select(b => b.BuildingId).ToList();
                
                AMRMeterResponseList respList = new();
                
                var meters = await _dbContext.AMRMeters
                    .Include(a => a.MakeModel)
                    .Where(a => (a.Active && ids.Contains(a.BuildingId)))
                    .ToListAsync();

                if (meters != null && meters.Count > 0)
                {
                    respList.Message = "Success";
                    respList.AMRMeterResponses = (List<AMRMeterResponse>)_mapper.Map<IEnumerable<AMRMeterResponse>>(meters);
                    return respList;
                }
                else {
                    respList.Message = $"No Meters found for user {userId}";
                    return respList;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving meters for user {userId}", userId);
                throw new ApplicationException($"Error retrieving meters for user {userId}: {ex.Message}");
            }
        }
        public async Task<AMRMeterResponseList> GetMetersForUserChartAsync(int userId, int chartId, bool isTenant = false)
        {
            try
            {
                int meterMakeModelId = 0;
                switch (chartId)
                {
                    case 1:
                        {
                            meterMakeModelId = 1;
                            break;
                        }
                    case 2:
                        {
                            meterMakeModelId = 2;
                            break;
                        }
                    default:
                        {
                            meterMakeModelId = 1;
                            break;
                        }
                }
                
                User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                
                var buildings = (await _buildingRepo.GetBuildings(user.UmfaId)).UmfaBuildings;
                
                List<int> ids = buildings.Select(b => b.BuildingId).ToList();
               
                var tenantMeters = new List<UmfaTenantUserMeter>();
                if(isTenant)
                {
                    tenantMeters = await _umfaService.GetTenantUserMetersAsync(new UmfaTenantUserMetersRequest { UmfaUserId = user.UmfaId, IsTenant = isTenant });
                }

                AMRMeterResponseList respList = new();
                var meters = await _dbContext.AMRMeters
                    .Include(a => a.MakeModel)
                    .Where(a =>
                    (
                        a.Active
                        && a.MakeModel.UtilityId == meterMakeModelId
                        && ids.Contains(a.BuildingId)
                        && (!isTenant || tenantMeters.Select(tm => tm.MeterNo).Contains(a.MeterNo))
                    )).ToListAsync();
                
                if (meters != null && meters.Count > 0)
                {
                    respList.Message = "Success";
                    respList.AMRMeterResponses = (List<AMRMeterResponse>)_mapper.Map<IEnumerable<AMRMeterResponse>>(meters);
                    return respList;
                }
                else
                {
                    respList.Message = $"No Meters found for user {userId}";
                    return respList;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving meters for user {userId}", userId);
                throw new ApplicationException($"Error retrieving meters for user {userId}: {ex.Message}");
            }
        }

        public bool RemoveMeterAsync(int meterId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                var ret = await _dbContext.SaveChangesAsync();
                return ret > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while saving meter: {Message}", ex.Message);
                throw new ApplicationException($"Error while saving meter: {ex.Message}");
            }
        }
    }
}
