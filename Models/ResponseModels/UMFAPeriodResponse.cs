
using ClientPortal.Data.Entities;

namespace ClientPortal.Models
{
    public class UMFAPeriodResponse
    {
        public int BuildingId { get; set; }
        public string Status { get; set; } = "Success";
        public string ErrorMessage { get; set; }
        public List<UMFAPeriod> Periods { get; set; }

        public UMFAPeriodResponse() { }

        public UMFAPeriodResponse(int buildingId)
        {
            this.BuildingId = buildingId;
            this.Status = "Success";
            this.ErrorMessage = "";
            this.Periods = new();
        }
    }
}
