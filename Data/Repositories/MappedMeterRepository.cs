using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Data.Repositories
{
    public interface IMappedMeterRepository
    {
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersAsync();
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuildingAsync(int buildingId);
        public Task<MappedMeterResponse<MappedMeter>> GetMappedMeterAsync(int id);
        public Task UpdateMappedMeterAsync(MappedMeter mm);
        public Task DeleteMappedMeterAsync(int id);
    }


    public class MappedMeterRepository : IMappedMeterRepository
    {
        private readonly ILogger<MappedMeterRepository> _logger;
        private readonly PortalDBContext _portalDBContext;


        public MappedMeterRepository(ILogger<MappedMeterRepository> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _portalDBContext = portalDBContext;
        }

        public async Task DeleteMappedMeterAsync(int id)
        {
            _portalDBContext.Remove(id);

            await _portalDBContext.SaveChangesAsync();
        }

        public async Task<MappedMeterResponse<MappedMeter>> GetMappedMeterAsync(int id)
        {
            var ret = new MappedMeterResponse<MappedMeter>();
            try
            {
                var result = await _portalDBContext.MappedMeters.FindAsync(id);

                if (result != null)
                {
                    ret.ResponseMessage = "Success";
                    ret.Body = result;
                }
                else
                {
                    ret.ResponseMessage = "Failed";
                    ret.ErrorMessage = $"No MappedMeter with id: {id}.";
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occured while retrieving MappedMeter {id}");

                ret.ResponseMessage = "Error";
                ret.ErrorMessage = ex.Message;

                return ret;
            }
        }

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersAsync()
        {
            var ret = new MappedMeterResponse<List<MappedMeter>>();
            try
            {
                var result = await _portalDBContext.MappedMeters.ToListAsync();
                
                if (result != null && result.Count > 0)
                {
                    ret.ResponseMessage = "Success";
                    ret.Body = result;
                }
                else
                {
                    ret.ResponseMessage = "Failed";
                    ret.ErrorMessage = $"No results returned.";
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occured while retrieving MappedMeters");
                
                ret.ResponseMessage = "Error";
                ret.ErrorMessage = ex.Message;
               
                return ret;
            }
        }

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuildingAsync(int buildingId)
        {
            var ret = new MappedMeterResponse<List<MappedMeter>>();

            try
            {
                var result = await _portalDBContext.MappedMeters.Where(mm => mm.BuildingId.Equals(buildingId)).ToListAsync();

                if (result != null && result.Count > 0)
                {
                    ret.ResponseMessage = "Success";
                    ret.Body = result;
                }
                else
                {
                    ret.ResponseMessage = "Failed";
                    ret.ErrorMessage = $"No results returned for buildingId {buildingId}";
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occured while retrieving MappedMeters for buildingId {buildingId}");

                ret.ResponseMessage = "Error";
                ret.ErrorMessage = ex.Message;

                return ret;
            }
        }

        public async Task UpdateMappedMeterAsync(MappedMeter mm)
        {
            _portalDBContext.MappedMeters.Update(mm);

            await _portalDBContext.SaveChangesAsync();
        }
    }
}
