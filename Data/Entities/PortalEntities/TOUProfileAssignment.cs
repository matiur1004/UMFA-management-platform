using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    [Serializable]
    public class TOUProfileAssignment
    {
        public int Id { get; set; }
        public int TOUHeaderId { get; set; }
        [JsonIgnore]
        public TOUHeader TOUHeader { get; set; }
        public int TOUSeasonId { get; set; }
        [JsonIgnore]
        public TOUSeason TOUSeason { get; set; }
        public int TOUDayTypeId { get; set; }
        [JsonIgnore]
        public TOUDayType TOUDayType { get; set; }
        public int TOUHalfHourId { get; set; }
        [JsonIgnore]
        public TOUHalfHour TOUHalfHour { get; set; }
        public int TOURegisterId { get; set; }
        [JsonIgnore]
        public TOURegister TOURegister { get; set; }
        public bool Active { get; set; }
    }
}
