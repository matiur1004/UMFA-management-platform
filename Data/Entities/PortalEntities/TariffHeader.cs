using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class TariffHeader
    {
        public int Id { get; set; }
        public int UtilitySupplierId { get; set; }
        [JsonIgnore]
        public UtilitySupplier UtilitySupplier { get; set; }
        public string Name { get; set; }
        public string? TransmissionZone { get; set; }
        public string? VoltageStart { get; set; }
        public string? VoltageEnd { get; set; }
        public string? DemandStart { get; set; }
        public string? DemandEnd { get; set; }
        public string? AmpStart { get; set; }
        public string? AmpEnd { get; set; }
        public string TariffCode { get; set; }
        public string? TariffDesc { get; set; }
        public int TOUHeaderId { get; set; }
        [JsonIgnore]
        public TOUHeader TOUHeader { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TOUAllocation> TOUAllocations { get; set; }
    }
}
