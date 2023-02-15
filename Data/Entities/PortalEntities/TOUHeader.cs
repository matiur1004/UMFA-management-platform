using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class TOUHeader
    {
        public int Id { get; set; }
        public int UtilitySupplierId { get; set; }
        [JsonIgnore]
        public UtilitySupplier UtilitySupplier { get; set; }
        public string Name { get; set; }
        public bool IsDefault { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TariffHeader> TariffHeaders { get; set; }
        [JsonIgnore]
        public List<TOUProfileAssignment> TOUProfileAssignments { get; set; }
        [JsonIgnore]
        public List<TOUSeason> TOUSeasons { get; set; }
        [JsonIgnore]
        public List<TOUDayOfWeekDayType> TOUDayOfWeekDayTypes { get; set; }
    }
}
