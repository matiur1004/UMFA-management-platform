using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    [Serializable]
    [Keyless]
    public class UMFABuilding
    {
        public int BuildingId { get; set; }
        public string Name { get; set; }
        public int PartnerId { get; set; }
        public string Partner { get; set; }
    }

    [Serializable]
    [Keyless]
    public class UMFAPeriod
    {
        [JsonPropertyName("periodId")]
        public int PeriodId { get; set; }

        [JsonPropertyName("periodName")]
        public string PeriodName { get; set; }

        [JsonPropertyName("periodStart")]
        public DateTime PeriodStart { get; set; }

        [JsonPropertyName("periodEnd")]
        public DateTime PeriodEnd { get; set; }
    }
}
