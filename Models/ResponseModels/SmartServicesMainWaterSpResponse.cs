namespace ClientPortal.Models.ResponseModels
{
    public class SmartServicesMainWaterSpResponse
    {
        public List<SmartServicesMainWaterStatistics> Statistics { get; set; }
        public List<SmartServicesMainWaterConsumption> Consumptions { get; set; }
        public List<SmartServicesMainWaterProfile> ProfileData { get; set; }
    }

    public class SmartServicesMainWaterStatistics
    {
        public long SupplyToLocationTypeId { get; set; }
        public string SupplyToLocationName { get; set; }
        public double Usage { get; set; }
    }

    public class SmartServicesMainWaterConsumption
    {
        public string SupplyToLocationName { get; set; }
        public int? Month { get; set; }
        public int? Day { get; set; }
        public int? Hour { get; set; }
        public int? WeekDay { get; set; }
        public string? DayOfWeek { get; set; }
        public string? MonthShort { get; set; }
        public double Usage { get; set; }
    }

    public class SmartServicesMainWaterProfile
    {
        public DateTime ReadingDate { get; set; }
        public double Usage { get; set; }
    }
}
