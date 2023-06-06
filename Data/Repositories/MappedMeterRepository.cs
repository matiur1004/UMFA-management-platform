using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Data.Repositories
{
    public interface IMappedMeterRepository
    {
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMeters();
        public Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuilding(int buildingId);

        public Task<MappedMeterResponse<MappedMeter>> GetMappedMeter(int id);
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

        public async Task<MappedMeterResponse<MappedMeter>> GetMappedMeter(int id)
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

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMeters()
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

        public async Task<MappedMeterResponse<List<MappedMeter>>> GetMappedMetersByBuilding(int buildingId)
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
    }
}
