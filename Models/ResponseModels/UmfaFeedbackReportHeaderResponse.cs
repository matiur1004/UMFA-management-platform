namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportHeaderResponse
    {
        public string Portfolio { get; set; }
        public string Property { get; set; }
        public double GLA { get; set; }
        public DateTime PeriodFrom { get; set; }
        public DateTime PeriodTo { get; set; }
    }
}
