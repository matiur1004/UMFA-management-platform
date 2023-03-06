using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class TOUDayType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TOUProfileAssignment> TOUProfileAssignments { get; set; }
        [JsonIgnore]
        public List<TOUDayOfWeekDayType> TOUDayOfWeekDayTypes { get; set; }
    }
}
