namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportSewerUsage
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public int Days { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public double? Sup_kLUsage { get; set; }
        public double? Tenants_kL { get; set; }
        public double? CA_kL { get; set; }
        public double? Aircon_kL { get; set; }
        public double? Tenants_Rec_kL { get; set; }
        public double? Tenants_UnRec_kL { get; set; }
        public double? CA_Rec_kL { get; set; }
        public double? CA_UnRec_kL { get; set; }
        public double? Aircon_Rec_kL { get; set; }
        public double? Aircon_UnRec_kL { get; set; }
    }
}
