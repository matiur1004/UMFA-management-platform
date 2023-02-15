using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class TOUHalfHour
    {
        public int Id { get; set; }
        public TimeSpan Start { get; set; }
        public TimeSpan End { get; set; }
        public int HalfHourNr { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TOUAllocation> TOUAllocations { get; set; }
        [JsonIgnore]
        public List<TOUProfileAssignment> TOUProfileAssigments { get; set; }
        [JsonIgnore]
        public List<ProfileData> ProfileData { get; set; }
    }
}
