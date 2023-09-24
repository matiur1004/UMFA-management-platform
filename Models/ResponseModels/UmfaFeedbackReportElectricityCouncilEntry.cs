namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportElectricityCouncilEntry
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; }
        public int PeriodDays { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public DateTime CouncilStart { get; set; }
        public DateTime CouncilEnd { get; set; }
        public double? kWhUsage { get; set; }
        public double? kVAUSage { get; set; }
        public decimal? TotalAmount { get; set; }
        public double? RecoveryPerc { get; set; }
    }
}
