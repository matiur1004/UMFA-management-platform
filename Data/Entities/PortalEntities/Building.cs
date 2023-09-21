using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class Building
    {
        public int Id { get; set; }
        public int UmfaId { get; set; }
        public string Name { get; set; }
        public int PartnerId { get; set; }
        public string Partner { get; set; }
        [JsonIgnore]
        public List<BuildingSupplierUtility> BuildingSupplierUtilities { get; set; }
        public List<User> Users { get; set; }

        [JsonIgnore]
        public ICollection<AMRMeter> AMRMeters { get; set; }
    }
}
