namespace ClientPortal.Data.Entities
{
    [Serializable]
    [Keyless]
    public class DemandProfileHeader
    {
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal MaxDemand { get; set; }
        public DateTime MaxDemandDate { get; set; }
        public decimal PeriodUsage { get; set; }
        public decimal DataPercentage { get; set; }
        public List<DemandProfile> Profile { get; set; }
    }

    [Serializable]
    [Keyless]
    public class DemandProfile
    {
        public DateTime ReadingDate { get; set; }
        public string ShortName { get; set; }
        public decimal Demand { get; set; }
        public decimal ActEnergy { get; set; }
        public decimal ReActEnergy { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
