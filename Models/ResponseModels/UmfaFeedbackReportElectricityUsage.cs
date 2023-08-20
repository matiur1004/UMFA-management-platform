namespace ClientPortal.Models.ResponseModels
{
    public class UmfaFeedbackReportElectricityUsage
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public double Days { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public double Sup_kWhUsage { get; set; }
        public double Sup_kVAUsage { get; set; }
        public double PV_kWhUsage { get; set; }
        public double PV_kVAUsage { get; set; }
        public double Gen_kWhUsage { get; set; }
        public double Other_kWhUsage { get; set; }
        public double Tenants_kWh { get; set; }
        public double Tenants_kVA { get; set; }
        public double Aircon_kWh { get; set; }
        public double CA_kWh { get; set; }
        public double Gen_Sales_kWhUsage { get; set; }
        public double Tenants_Rec_kWh { get; set; }
        public double Tenants_UnRec_kWh { get; set; }
        public double CA_Rec_kWh { get; set; }
        public double CA_UnRec_kWh { get; set; }
        public double Aircon_Rec_kWh { get; set; }
        public double Aircon_UnRec_kWh { get; set; }
    }
}
