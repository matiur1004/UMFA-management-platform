using ClientPortal.Data.Entities;

namespace ClientPortal.Models
{
    public class UMFABuildingResponse
    {
        public int UserId { get; set; }
        public string Response { get; set; }
        public List<UMFABuilding> UmfaBuildings { get; set; }

        public UMFABuildingResponse()
        {
            UmfaBuildings = new List<UMFABuilding>();
            UserId = 0;
            Response = "initiated";
        }

        public UMFABuildingResponse(int userId)
        {
            UmfaBuildings = new List<UMFABuilding>();
            this.UserId = userId;
            Response = $"initiated for user {userId}";
        }
    }
}
