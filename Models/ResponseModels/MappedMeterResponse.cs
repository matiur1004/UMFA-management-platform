using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class MappedMeterResponse
    {
        public int BuildingId { get; set; }
        public string Response { get; set; }
        public string ErrorMessage { get; set; }
        public List<MappedMeter> MappedMeters { get; set; }

        public MappedMeterResponse() 
        {
            BuildingId = 0;
            Response = "Initiated";
            MappedMeters = new List<MappedMeter>();
        }

        public MappedMeterResponse(int buildingId)
        {
            BuildingId = buildingId;
            Response = $"Initiated for building {buildingId}";
            MappedMeters = new List<MappedMeter>();
        }
    }
}
