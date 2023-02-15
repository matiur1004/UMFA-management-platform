using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class TOUDaysOfWeek
    {
        public int Id { get; set; }
        public int DayNr { get; set; }
        public string DayName { get; set; }
        public bool Active { get; set; }
        [JsonIgnore]
        public List<TOUAllocation> TOUAllocations { get; set; }
        [JsonIgnore]
        public List<ProfileData> ProfileData { get; set; }
        [JsonIgnore]
        public List<TOUDayOfWeekDayType> TOUDayOfWeekDayTypes { get; set; }
    }
}
