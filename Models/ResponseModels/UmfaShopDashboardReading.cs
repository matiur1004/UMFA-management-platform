namespace ClientPortal.Models.ResponseModels
{
    public class UmfaShopDashboardReading
    {
        public int BuildingServiceID { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public DateTime PreviousReadingdate { get; set; }
        public double PreviousReading { get; set; }
        public DateTime CurrentReadingDate { get; set; }
        public double CurrentReading { get; set; }
        public double ReadingUsage { get; set; }
        public double CTRatio { get; set; }
        public double BillingUsage { get; set; }
        public double Contribution { get; set; }
        public string ReadingMethod { get; set; }
        public bool Estimated { get; set; }
        public double TotalArea { get; set; }
        public double AssignedArea { get; set; }
        public string Photo { get; set; }
    }
}
