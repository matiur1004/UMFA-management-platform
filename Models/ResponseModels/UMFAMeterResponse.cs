using ClientPortal.Data.Entities.UMFAEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class UMFAMeterResponse
    {
        public int BuildingId { get; set; }
        public string Response { get; set; }
        public List<UMFAMeter> UmfaMeters { get; set; }

        public UMFAMeterResponse()
        {
            UmfaMeters = new List<UMFAMeter>();
            BuildingId = 0;
            Response = "initiated";
        }

        public UMFAMeterResponse(int buildingId)
        {
            UmfaMeters = new List<UMFAMeter>();
            this.BuildingId = buildingId;
            Response = $"initiated for Building {buildingId}";
        }
    }
}
