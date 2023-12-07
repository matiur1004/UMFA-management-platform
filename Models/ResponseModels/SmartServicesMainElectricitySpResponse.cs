namespace ClientPortal.Models.ResponseModels
{
    public class SmartServicesMainElectricitySpResponse
    {
        public List<SmartServicesMainElectricityStatistics> Statistics { get; set; }
        public List<SmartServicesMainElectricityConsumption> Consumptions { get; set; }
        public List<SmartServicesMainElectricityProfile> ProfileData { get; set; }
    }

    public class SmartServicesMainElectricityStatistics
    {
        public long SupplyToLocationTypeId { get; set; }
        public string SupplyToLocationName { get; set; }
        public double Energy { get; set; }
    }

    public class SmartServicesMainElectricityConsumption
    {
        public string SupplyToLocationName { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public double Energy { get; set; }
    }

    public class SmartServicesMainElectricityProfile
    {
        public DateTime ReadingDate { get; set; }
        public double Energy { get; set; }
        public double MaxDemand { get; set; }
    }
}
