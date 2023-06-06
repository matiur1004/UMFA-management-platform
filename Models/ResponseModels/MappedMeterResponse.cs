using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class MappedMeterResponse<T>
    {
        public int BuildingId { get; set; }
        public string ResponseMessage { get; set; }
        public string ErrorMessage { get; set; }
        public T Body { get; set; }

        public MappedMeterResponse() 
        {
            BuildingId = 0;
            ResponseMessage = "Initiated";
        }

        public MappedMeterResponse(int buildingId)
        {
            BuildingId = buildingId;
            ResponseMessage = $"Initiated for building {buildingId}";
        }
    }
}
