namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportElectricityAmount
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public int Days { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public decimal Sup_kWhAmount { get; set; }
        public decimal Sup_kVAAmount { get; set; }
        public decimal Sup_BFeeAmount { get; set; }
        public decimal PV_kWhAmount { get; set; }
        public decimal PV_kVAAmount { get; set; }
        public decimal Gen_kWhAmount { get; set; }
        public decimal Gen_BFeeAmount { get; set; }
        public decimal Other_kWhAmount { get; set; }
        public decimal? Ten_kWh_Rec { get; set; }
        public decimal? Ten_kVA_Rec { get; set; }
        public decimal? Ten_BFee_Rec { get; set; }
        public decimal? CA_kWh_Rec { get; set; }
        public decimal? CA_kVA_Rec { get; set; }
        public decimal? CA_BFee_Rec { get; set; }
        public decimal? AC_kWh_Rec { get; set; }
        public decimal? AC_kVA_Rec { get; set; }
        public decimal? AC_BFee_Rec { get; set; }
        public decimal? Gen_TenkWh_Rec { get; set; }
        public decimal? Gen_CAkWh_Rec { get; set; }
        public decimal? Gen_TenBFee_Rec { get; set; }
        public decimal? Gen_CABFee_Rec { get; set; }
        public decimal? Ten_kWh_UnRec { get; set; }
        public decimal? Ten_kVA_UnRec { get; set; }
        public decimal? Ten_BFee_UnRec { get; set; }
        public decimal? CA_kWh_UnRec { get; set; }
        public decimal? CA_kVA_UnRec { get; set; }
        public decimal? CA_BFee_UnRec { get; set; }
        public decimal? AC_kWh_UnRec { get; set; }
        public decimal? AC_kVA_UnRec { get; set; }
        public decimal? AC_BFee_UnRec { get; set; }
        public decimal? Gen_TenkWh_UnRec { get; set; }
        public decimal? Gen_CAkWh_UnRec { get; set; }
        public decimal? Gen_TenBFee_UnRec { get; set; }
        public decimal? Gen_CABFee_UnRec { get; set; }
    }
}
