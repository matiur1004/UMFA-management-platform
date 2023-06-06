using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Data.Repositories
{
    public interface IMappedMeterRepository
    {
        public Task<MappedMeterResponse> GetMappedMeters();
        public Task<MappedMeterResponse> GetMappedMeters(int buildingId);
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

        public async Task<MappedMeterResponse> GetMappedMeters()
        {
            var ret = new MappedMeterResponse();
            try
            {
                var result = await _portalDBContext.MappedMeters.ToListAsync();
                
                if (result != null && result.Count > 0)
                {
                    ret.Response = "Success";
                    ret.MappedMeters = result;
                }
                else
                {
                    ret.Response = "Failed";
                    ret.ErrorMessage = $"No results returned.";
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occured while retrieving MappedMeters");
                
                ret.Response = "Error";
                ret.ErrorMessage = ex.Message;
               
                return ret;
            }
        }

        public async Task<MappedMeterResponse> GetMappedMeters(int buildingId)
        {
            var ret = new MappedMeterResponse();

            try
            {
                var result = await _portalDBContext.MappedMeters.Where(mm => mm.BuildingId.Equals(buildingId)).ToListAsync();

                if (result != null && result.Count > 0)
                {
                    ret.Response = "Success";
                    ret.MappedMeters = result;
                }
                else
                {
                    ret.Response = "Failed";
                    ret.ErrorMessage = $"No results returned for buildingId {buildingId}";
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occured while retrieving MappedMeters for buildingId {buildingId}");

                ret.Response = "Error";
                ret.ErrorMessage = ex.Message;

                return ret;
            }
        }
    }
}
