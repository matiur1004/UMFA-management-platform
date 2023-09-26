namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportVacantUsage
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public int Days { get; set; }
        public string Tenants { get; set; }
        public double UsageValue { get; set; }
    }
}
