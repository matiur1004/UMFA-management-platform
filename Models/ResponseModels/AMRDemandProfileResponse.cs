
namespace ClientPortal.Models.ResponseModels
{
    [Serializable]
    public class DemandProfileResponseHeader
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
        public double PeakUsage { get; set; }
        public double StandardUsage { get; set; }
        public double OffPeakUsage { get; set; }
        public double PeakDemand {  get; set; }
        public double StandardDemand { get; set; }
        public double OffPeakDemand { get; set; }
    }

    [Serializable]
    public class DemandProfileResponseDetail
    {
        public DateTime ReadingDate { get; set; }
        public string ShortName { get; set; }
        public decimal Demand { get; set; }
        public decimal ActEnergy { get; set; }
        public decimal ReActEnergy { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }

    }

    [Serializable]
    public class DemandProfileResponse
    {
        public string Status { get; set; } = "Success";
        public string ErrorMessage { get; set; } = "";
        public DemandProfileResponseHeader Header { get; set; }
        public List<DemandProfileResponseDetail> Detail { get; set; }
    }
}
