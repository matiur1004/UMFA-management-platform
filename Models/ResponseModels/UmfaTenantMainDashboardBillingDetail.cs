namespace ClientPortal.Models.ResponseModels
{
    public class UmfaTenantMainDashboardBillingDetail
    {
        public int ShopId { get; set; }
        public string Shop { get; set; }
        public int GroupID { get; set; }
        public string InvGroup { get; set; }
        public string BillingType { get; set; }
        public string MeterNo { get; set; }
        public DateTime PreviousReadingDate { get; set; }
        public string PreviousReading { get; set; }
        public DateTime ReadingDate { get; set; }
        public double CurrentReading { get; set; }
        public double Usage { get; set; }
        public decimal Amount { get; set; }
    }
}
