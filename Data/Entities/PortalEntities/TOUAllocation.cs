using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class TOUAllocation
    {
        public int Id { get; set; }
        public int TariffHeaderId { get; set; }
        [JsonIgnore]
        public TariffHeader TariffHeader { get; set; }
        public int TOUDaysOfWeekId { get; set; }
        [JsonIgnore]
        public TOUDaysOfWeek TOUDaysOfWeek { get; set; }
        public int TOUHalfHourId { get; set; }
        [JsonIgnore]
        public TOUHalfHour TOUHalfHour { get; set; }
        public int TOURegisterId { get; set; }
        [JsonIgnore]
        public TOURegister TOURegister { get; set; }
        public bool Active { get; set; }
    }
}
