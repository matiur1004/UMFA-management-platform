using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    public class BuildingSupplierUtility
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        [JsonIgnore]
        public Building Building { get; set; }
        public int UtilitySupplierId { get; set; }
        [JsonIgnore]
        public UtilitySupplier UtilitySupplier { get; set; }
        public int UtilityId { get; set; }
        [JsonIgnore]
        public Utility Utility { get; set; }
        public bool Active { get; set; }
    }
}
