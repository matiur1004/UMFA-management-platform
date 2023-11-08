namespace ClientPortal.Models.ResponseModels
{
    public class AmrDemandProfileAlarmsSpResponse
    {
        public List<AmrDemandProfileAlarmHeader> Headers { get; set; }
        public List<AmrDemandProfileAlarmReading> Readings { get; set; }
    }

    public class AmrDemandProfileAlarmHeader
    {
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double MaxDemand { get; set; }
        public DateTime MaxDemandDate { get; set; }
        public double NightFlow { get; set; }
        public double PeriodUsage { get; set; }
        public double DataPercentage { get; set; }
    }

    public class AmrDemandProfileAlarmReading
    {
        public DateTime ReadingDate { get; set; }
        public double Energy { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
