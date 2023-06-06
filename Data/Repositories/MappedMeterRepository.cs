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
        public Task<MappedMeterResponse> GetMappedMeters()
        {
            throw new NotImplementedException();
        }

        public Task<MappedMeterResponse> GetMappedMeters(int buildingId)
        {
            throw new NotImplementedException();
        }
    }
}
