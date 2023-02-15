using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class TOURegister
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TOUAllocation> TOUAllocations { get; set; }
        [JsonIgnore]
        public List<TOUProfileAssignment> TOUProfileAssignments { get; set; }
    }
}
