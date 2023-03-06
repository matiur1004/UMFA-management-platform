
using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class UtilitySupplier
    {
        public int Id { get; set; }
        public string SupplierName { get; set; }
        public string? SupplierDesc { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<BuildingSupplierUtility> BuildingSupplierUtilities { get; set; }
        [JsonIgnore]
        public List<TOUHeader> TOUHeaders { get; set; }
        [JsonIgnore]
        public List<TariffHeader> TariffHeaders { get; set; }
    }
}
