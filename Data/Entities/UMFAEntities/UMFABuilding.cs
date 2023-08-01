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
        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
    }
}
