using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class TOUSeason
    {
        public int Id { get; set; }
        public int TOUHeaderId { get; set; }
        public TOUHeader TOUHeader { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TOUProfileAssignment> TOUProfileAssignments { get; set; }
        [JsonIgnore]
        public List<TOUSeasonMonth> TOUSeasonMonths { get; set; }
    }
}
