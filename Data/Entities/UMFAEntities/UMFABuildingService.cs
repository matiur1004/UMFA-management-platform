using DevExpress.Xpo;
using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    [Serializable]
    public class UMFABuildingService
    {
        [Key]
        [JsonPropertyName("umfaBuildingServiceId")]
        public int UMFABuildingServiceId { get; set; }

        [JsonPropertyName("buildingId")]
        public int BuildingId { get; set; }

        [JsonPropertyName("meterNo")]
        public string MeterNo { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("location")]
        public string Location { get; set; }
    }
}
