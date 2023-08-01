using DevExpress.Xpo;
using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    [Serializable]
    public class UMFABuildingService
    {
        [Key]
        public int UMFABuildingServiceId { get; set; }
        public int BuildingId { get; set; }
        public string MeterNo { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
    }
}
