using ClientPortal.Data.Entities.UMFAEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class UMFABuildingServiceResponse
    {
        public string Response { get; set; }
        public string ErrorMessage { get; set; } = "";
        public List<UMFABuildingService> BuildingServices { get; set; }
    }
}
