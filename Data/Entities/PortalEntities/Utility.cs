
using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class Utility
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public List<MeterMakeModel> MeterMakeModels { get; set; }
        [JsonIgnore]
        public List<BuildingSupplierUtility> BuildingSupplierUtilities { get; set; }

    }
}
