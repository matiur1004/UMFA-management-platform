
namespace ClientPortal.Models.ResponseModels
{
    [Serializable]
    public class AMRGraphProfileResponse
    {
        public string Status { get; set; } = "Success";
        public string ErrorMessage { get; set; } = "";
        public AMRGraphProfileResponseHeader Header { get; set; }
        public List<GraphProfileResponseDetail> Detail { get; set; }
    }

    [Serializable]
    public class AMRGraphProfileResponseHeader
    {
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal MaxFlow { get; set; }
        public DateTime MaxFlowDate { get; set; }
        public decimal NightFlow { get; set; }
        public decimal PeriodUsage { get; set; }
        public decimal DataPercentage { get; set; }
    }

    [Serializable]
    public class GraphProfileResponseDetail
    {
        public DateTime ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }
}
