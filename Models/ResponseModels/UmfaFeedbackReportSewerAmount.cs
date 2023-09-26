namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportSewerAmount
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public int Days { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public decimal? Sup_kLAmount { get; set; }
        public decimal? Sup_BFeeAmount { get; set; }
        public decimal? Ten_kL_Rec { get; set; }
        public decimal? Ten_BFee_Rec { get; set; }
        public decimal? CA_kL_Rec { get; set; }
        public decimal? CA_BFee_Rec { get; set; }
        public decimal? AC_kL_Rec { get; set; }
        public decimal? AC_BFee_Rec { get; set; }
        public decimal? Ten_kL_UnRec { get; set; }
        public decimal? Ten_BFee_UnRec { get; set; }
        public decimal? CA_kL_UnRec { get; set; }
        public decimal? CA_BFee_UnRec { get; set; }
        public decimal? AC_kL_UnRec { get; set; }
        public decimal? AC_BFee_UnRec { get; set; }
        public DateTime? CouncilStartDate { get; set; }
        public DateTime? CouncilEndDate { get; set; }
        public double? CouncilkL_Usage { get; set; }
        public decimal? CouncilkL_Amount { get; set; }
    }
}
