using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    public class UtilityRecoveryHeader
    {
        [JsonPropertyName("repType")]
        public string RepType { get; set; }

        [JsonPropertyName("buildingName")]
        public string BuildingName { get; set; }

        [JsonPropertyName("reconReadingInfo")]
        public string ReconReadingInfo { get; set; }
    }
}
